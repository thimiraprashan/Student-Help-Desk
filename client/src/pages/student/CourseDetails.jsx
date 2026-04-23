import React, { useContext, useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import { useAuth } from '../../lib/auth.jsx';
import Loading from '../../components/student/Loading';

const getStaticCourseDuration = (course) => {
    if (!course.courseContent) return 'Lifetime Access';
    let maxExpiryMs = 0;
    let hasExpiry = false;

    course.courseContent.forEach(chapter => {
        chapter.chapterContent.forEach(lecture => {
            if (lecture.lectureAccessDuration) {
                hasExpiry = true;
                const value = lecture.lectureAccessDuration;
                const unit = lecture.lectureAccessUnit || 'Days';

                let expMs = 0;
                if (unit === 'Minutes') expMs = value * 60 * 1000;
                else if (unit === 'Hours') expMs = value * 60 * 60 * 1000;
                else if (unit === 'Days') expMs = value * 24 * 60 * 60 * 1000;
                else if (unit === 'Months') expMs = value * 30 * 24 * 60 * 60 * 1000;

                if (expMs > maxExpiryMs) maxExpiryMs = expMs;
            }
        });
    });
    if (!hasExpiry) return 'Lifetime Access';
    return humanizeDuration(maxExpiryMs, { round: true, largest: 3, units: ['mo', 'w', 'd', 'h', 'm'] });
};

const calculateCourseExpiry = (course, purchaseData) => {
    if (!course.courseContent || !purchaseData) return { expired: false, text: 'Lifetime Access' };
    const baseDate = new Date(purchaseData.createdAt);
    let maxExpiryDate = new Date(baseDate.getTime());
    let hasExpiry = false;

    course.courseContent.forEach(chapter => {
        chapter.chapterContent.forEach(lecture => {
            if (lecture.lectureAccessDuration) {
                hasExpiry = true;
                const value = lecture.lectureAccessDuration;
                const unit = lecture.lectureAccessUnit || 'Days';

                let exp = new Date(baseDate.getTime());
                if (unit === 'Minutes') exp.setMinutes(exp.getMinutes() + value);
                else if (unit === 'Hours') exp.setHours(exp.getHours() + value);
                else if (unit === 'Days') exp.setDate(exp.getDate() + value);
                else if (unit === 'Months') exp.setMonth(exp.getMonth() + value);

                if (exp > maxExpiryDate) maxExpiryDate = exp;
            }
        });
    });

    if (!hasExpiry) return { expired: false, text: 'Lifetime Access' };

    const now = new Date();
    const diffMs = maxExpiryDate - now;

    if (diffMs <= 0) return { expired: true, text: 'Expired' };
    return { expired: false, text: humanizeDuration(diffMs, { round: true, largest: 3, units: ['mo', 'w', 'd', 'h', 'm'] }) };
};

const calculateLectureExpiry = (lecture, purchaseData) => {
  if (!purchaseData || !lecture.lectureAccessDuration) return null;
  const enrollDate = new Date(purchaseData.createdAt);
  let expiryDate = new Date(enrollDate);

  const value = lecture.lectureAccessDuration;
  const unit = lecture.lectureAccessUnit || 'Days';

  if (unit === 'Minutes') expiryDate.setMinutes(expiryDate.getMinutes() + value);
  else if (unit === 'Hours') expiryDate.setHours(expiryDate.getHours() + value);
  else if (unit === 'Days') expiryDate.setDate(expiryDate.getDate() + value);
  else if (unit === 'Months') expiryDate.setMonth(expiryDate.getMonth() + value);

  const now = new Date();
  const diffMs = expiryDate - now;

  if (diffMs <= 0) return { expired: true, text: 'Access expired' };
  return { expired: false, text: `Access expires in ${humanizeDuration(diffMs, { round: true, largest: 3, units: ['mo', 'w', 'd', 'h', 'm'] })}` };
};

const CourseDetails = () => {

  const { id } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [playerData, setPlayerData] = useState(null)
  const [purchaseData, setPurchaseData] = useState(null)
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)

  const { backendUrl, currency, userData, calculateChapterTime, calculateCourseDuration, calculateRating, calculateNoOfLectures } = useContext(AppContext)
  const { getToken } = useAuth()


  const fetchCourseData = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/course/' + id)

      if (data.success) {
        setCourseData(data.courseData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {

      toast.error(error.message)

    }

  }

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


  const enrollCourse = async () => {

    try {

      if (!userData) {
        return toast.warn('Login to Enroll')
      }

      if (isAlreadyEnrolled && purchaseData && !calculateCourseExpiry(courseData, purchaseData)?.expired) {
        return toast.warn('Already Enrolled')
      }

      const token = await getToken();

      const { data } = await axios.post(backendUrl + '/api/user/purchase',
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        if (data.session_url) {
          window.location.replace(data.session_url)
        } else if (data.freeEnrollment) {
          toast.success(data.message)
          window.location.replace('/my-enrollments')
        }
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [])

  const fetchPurchaseData = async (cId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(backendUrl + '/api/user/user-purchase', { courseId: cId }, { headers: { Authorization: `Bearer ${token}` }})
      if(data.success) {
        setPurchaseData(data.purchaseData)
      }
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (userData && courseData) {
      const isEnrolled = userData?.enrolledCourses?.includes(courseData._id)
      setIsAlreadyEnrolled(isEnrolled)
      if (isEnrolled) fetchPurchaseData(courseData._id);
    }
  }, [userData, courseData])

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-20 pt-10 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-course-deatails-heading-large text-course-deatails-heading-small font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <div className='flex items-center space-x-2 pt-3 pb-1 text-sm mt-4'>
            <p>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (<img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt=''
                className='w-3.5 h-3.5' />
              ))}
            </div>
            <p className='text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length === 1 ? 'rating' : 'ratings'})</p>

            <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length === 1 ? 'student' : 'students'}</p>
          </div>

          <p className='text-sm'>Course by <span className='text-blue-600 underline'>{courseData.educatorName || (courseData.educator?.name === 'null null' ? 'Platform Educator' : courseData.educator?.name)}</span></p>

          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img src={assets.down_arrow_icon} alt="arrow icon" className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`} />
                      <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-sm md:text-default">{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`} >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex flex-col gap-1 py-3 px-3 border border-gray-200 rounded-lg bg-gray-50 mb-3 hover:bg-gray-100 transition duration-200 shadow-sm">
                          <div className="flex items-center gap-2">
                             <img src={assets.play_icon} alt="bullet icon" className="w-4 h-4" />
                             <p className="font-semibold text-gray-800 text-sm md:text-base">{i + 1}. {lecture.lectureTitle}</p>
                          </div>
                          
                          <div className="pl-6 flex flex-col gap-2 mt-1">
                             {isAlreadyEnrolled && lecture.lectureAccessDuration && purchaseData && (
                                <p className={`text-xs md:text-sm flex items-center gap-1 ${calculateLectureExpiry(lecture, purchaseData)?.expired ? 'text-red-500' : 'text-green-600 font-medium'}`}>
                                   <img src={assets.time_left_clock_icon} className="w-3" alt="time left icon"/>
                                   {calculateLectureExpiry(lecture, purchaseData)?.text}
                                </p>
                             )}
                             
                             <div className="flex sm:flex-row flex-col items-start sm:items-center justify-between w-full pt-1 gap-2 sm:gap-4">
                                <div className="flex items-center gap-3">
                                  {lecture.isPreviewFree && !(isAlreadyEnrolled && purchaseData && calculateLectureExpiry(lecture, purchaseData)?.expired) && (
                                    <button onClick={() => setPlayerData({
                                      videoId: lecture.lectureUrl.split('/').pop().split('?v=').pop().split('?')[0].split('&')[0]
                                    })} className='text-sm bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-md hover:bg-blue-100 transition font-medium shadow-sm'>
                                        Preview
                                    </button>
                                  )}
                                </div>
                                <p className="text-gray-500 text-xs flex flex-row items-center gap-1">
                                   <img src={assets.time_clock_icon} className="w-3" alt="duration" />
                                   {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                                </p>
                             </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
            <p className="rich-text pt-3" dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}>
            </p>
          </div>
        </div>

        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
          {
            playerData
              ? <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full aspect-video' />
              : <img src={courseData.courseThumbnail} alt="" />
          }
          <div className="p-5">
            <div className="flex gap-3 items-center pt-2">
              {courseData.coursePrice === 0 ? (
                  <p className="text-green-600 md:text-3xl text-2xl font-semibold">Free Lecture</p>
              ) : (
                  <>
                    <p className="text-gray-800 md:text-4xl text-2xl font-semibold">{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
                    <p className="md:text-lg text-gray-500 line-through">{currency}{courseData.coursePrice}</p>
                    <p className="md:text-lg text-gray-500">{courseData.discount}% off</p>
                  </>
              )}
            </div>
            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="clock icon" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>
            <div className="flex items-center text-sm md:text-default gap-4 pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.time_left_clock_icon} alt="time left clock icon" />
                <p className="text-red-500 font-semibold">
                  {isAlreadyEnrolled && purchaseData ? (
                      calculateCourseExpiry(courseData, purchaseData)?.expired 
                      ? 'Course Access Expired' 
                      : `Expires in: ${calculateCourseExpiry(courseData, purchaseData)?.text}`
                  ) : (
                      `Course Access: ${getStaticCourseDuration(courseData)}`
                  )}
                </p>
              </div>
            </div>

            <button onClick={enrollCourse} className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium">
              {isAlreadyEnrolled && purchaseData && !calculateCourseExpiry(courseData, purchaseData)?.expired ? "Already Enrolled" : "Enroll Now"}
            </button>
            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">What's in the course?</p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500 space-y-1">
                <li>Comprehensive coverage of the semester syllabus.</li>
                <li>Access to peer-led discussions and Kuppi sessions.</li>
                <li>Deep-dive solutions for past exam papers.</li>
                <li>Interactive quizzes to track academic progress.</li>
                <li>Priority access to exclusive industry placements.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
};

export default CourseDetails;
