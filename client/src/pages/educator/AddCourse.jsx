import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify'
import Quill from 'quill';
import YouTube from 'react-youtube';
import axios from 'axios'
import { AppContext } from '../../context/AppContext';

const AddCourse = () => {

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, getToken } = useContext(AppContext)

  const [courseTitle, setCourseTitle] = useState('')
  const [educatorName, setEducatorName] = useState('')
  const [isFreeCourse, setIsFreeCourse] = useState(false)
  const [courseAccessDuration, setCourseAccessDuration] = useState('')
  const [courseAccessUnit, setCourseAccessUnit] = useState('Days')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [courseYear, setCourseYear] = useState(1)
  const [courseSemester, setCourseSemester] = useState(1)
  const [image, setImage] = useState(null)
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  
  const [showChapterPopup, setShowChapterPopup] = useState(false);
  const [chapterTitleInput, setChapterTitleInput] = useState('');
  const [errors, setErrors] = useState({});
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false
  });

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      setShowChapterPopup(true);
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const addChapter = () => {
      if (chapterTitleInput.trim()) {
        const newChapter = {
          chapterId: crypto.randomUUID(),
          chapterTitle: chapterTitleInput.trim(),
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
        setShowChapterPopup(false);
        setChapterTitleInput('');
      }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: crypto.randomUUID()
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false
    });
  };

  const handleSubmit = async (e) => {
    try {

      e.preventDefault();

      let newErrors = {};
      if (!courseTitle.trim()) newErrors.courseTitle = true;
      if (!educatorName.trim()) newErrors.educatorName = true;
      const descText = quillRef.current.getText().trim();
      if (!descText) newErrors.courseDescription = true;

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return; 
      }

      if (courseTitle.length > 100) {
        return toast.error('Course Title must not exceed 100 characters.')
      }
      if (educatorName.length > 100) {
        return toast.error('Instructor Name must not exceed 100 characters.')
      }
      if (quillRef.current.getText().trim().length > 1000) {
        return toast.error('Course description must not exceed 1000 characters.')
      }
      if (coursePrice === '' || Number(coursePrice) < 0) {
        return toast.error('Valid course price is required.')
      }

      if (!image) {
        toast.error('Thumbnail Not Selected')
      }

      const finalizedChapters = chapters.map(chapter => ({
         ...chapter,
         chapterContent: chapter.chapterContent.map(lecture => ({
            ...lecture,
            lectureAccessDuration: courseAccessDuration === '' ? 0 : Number(courseAccessDuration),
            lectureAccessUnit: courseAccessUnit
         }))
      }));

      const courseData = {
        courseTitle,
        educatorName,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseYear: Number(courseYear),
        courseSemester: Number(courseSemester),
        courseContent: finalizedChapters,
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)

      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setEducatorName('')
        setCoursePrice(0)
        setDiscount(0)
        setCourseYear(1)
        setCourseSemester(1)
        setImage(null)
        setChapters([])
        quillRef.current.root.innerHTML = ""
      } else (
        toast.error(data.message)
      )

    } catch (error) {
      toast.error(error.message)
    }

  };

  useEffect(() => {
    // Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
      quillRef.current.on('text-change', () => {
        setDescriptionLength(quillRef.current.getText().trim().length);
      });
    }
  }, []);

  useEffect(() => {
    console.log(chapters);
  }, [chapters]);

  return (
    <div className='h-[calc(100vh-64px)] overflow-hidden flex flex-col md:px-8 md:pt-3 md:pb-6 p-4 bg-gray-50 font-sans'>
      <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto h-full text-gray-600'>
        
        {/* Left Column: Course Details */}
        <div className='w-full md:w-[60%] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-y-auto h-full relative border-t-4 border-t-blue-500 custom-scrollbar'>
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 shrink-0">Course Information</h2>

          <div className='flex flex-col md:flex-row gap-4 mb-4 shrink-0'>
            <div className='flex flex-col gap-1 w-full'>
              <p className="font-semibold text-xs uppercase tracking-wide text-gray-700">Course Title</p>
              <input onChange={e => {setCourseTitle(e.target.value); if(errors.courseTitle) setErrors({...errors, courseTitle: false})}} value={courseTitle} type="text" placeholder={errors.courseTitle ? "Please fill Course Title" : ''} className={`outline-none py-2 px-3 text-sm rounded-lg border focus:ring-2 focus:ring-blue-100 transition shadow-sm ${courseTitle.length > 100 || errors.courseTitle ? 'border-red-500 placeholder-red-400' : 'border-gray-200'}`} />
              <span className={`text-[10px] ml-1 mt-0.5 ${(courseTitle.length > 100 || errors.courseTitle) ? 'text-red-500' : 'text-gray-400'}`}>{courseTitle.length}/100 chars</span>
            </div>

            <div className='flex flex-col gap-1 w-full'>
              <p className="font-semibold text-xs uppercase tracking-wide text-gray-700">Instructor Name</p>
              <input onChange={e => {setEducatorName(e.target.value); if(errors.educatorName) setErrors({...errors, educatorName: false})}} value={educatorName} type="text" placeholder={errors.educatorName ? "Please fill Instructor Name" : ''} className={`outline-none py-2 px-3 text-sm rounded-lg border focus:ring-2 focus:ring-blue-100 transition shadow-sm ${educatorName.length > 100 || errors.educatorName ? 'border-red-500 placeholder-red-400' : 'border-gray-200'}`} />
              <span className={`text-[10px] ml-1 mt-0.5 ${(educatorName.length > 100 || errors.educatorName) ? 'text-red-500' : 'text-gray-400'}`}>{educatorName.length}/100 chars</span>
            </div>
          </div>

          <div className='flex flex-col gap-1 mb-4 shrink-0 relative'>
            <p className="font-semibold text-xs uppercase tracking-wide text-gray-700">Course Description</p>
            <div onClick={() => {if(errors.courseDescription) setErrors({...errors, courseDescription: false})}} className={`relative rounded-xl shadow-sm transition-all [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl [&_.ql-editor]:min-h-[80px] [&_.ql-editor]:max-h-[150px] border ${descriptionLength > 1000 || errors.courseDescription ? 'border-red-400 shadow-[0_0_0_2px_rgba(248,113,113,0.1)]' : 'border-gray-200'}`}>
               {errors.courseDescription && descriptionLength === 0 && (
                  <div className="absolute top-[48px] left-4 text-red-500 pointer-events-none text-sm z-10 font-medium">Please fill Course Description</div>
               )}
               <div ref={editorRef} className='bg-white'></div>
            </div>
            <span className={`text-[10px] ml-1 mt-0.5 ${(descriptionLength > 1000 || errors.courseDescription) ? 'text-red-500' : 'text-gray-400'}`}>{descriptionLength}/1000 chars limit</span>
          </div>

          <div className='flex flex-col md:flex-row gap-4 mb-4 bg-gray-50/50 p-3.5 rounded-xl border border-gray-200/60 shrink-0'>
             <div className='flex flex-col gap-1 w-full'>
               <p className="font-semibold text-xs uppercase tracking-wide text-gray-700">Academic Year</p>
               <select onChange={e => setCourseYear(e.target.value)} value={courseYear} className='outline-none py-2 px-3 text-sm rounded-lg border border-gray-200 bg-white shadow-sm cursor-pointer focus:border-blue-300 transition'>
                 <option value={1}>Year 1</option>
                 <option value={2}>Year 2</option>
                 <option value={3}>Year 3</option>
                 <option value={4}>Year 4</option>
               </select>
             </div>
             
             <div className='flex flex-col gap-1 w-full'>
               <p className="font-semibold text-xs uppercase tracking-wide text-gray-700">Semester Term</p>
               <select onChange={e => setCourseSemester(e.target.value)} value={courseSemester} className='outline-none py-2 px-3 text-sm rounded-lg border border-gray-200 bg-white shadow-sm cursor-pointer focus:border-blue-300 transition'>
                 <option value={1}>Semester 1</option>
                 <option value={2}>Semester 2</option>
               </select>
             </div>

             <div className='flex flex-col gap-1 w-full'>
               <p className="font-semibold text-xs uppercase tracking-wide text-gray-700">Cover Thumbnail</p>
               <label htmlFor='thumbnailImage' className={`flex items-center gap-2 cursor-pointer bg-white border px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition w-full h-[38px] group ${!image ? 'border-dashed border-gray-300' : 'border-gray-200'}`}>
                 <img src={assets.file_upload_icon} alt="Upload" className='p-1 bg-blue-50 group-hover:bg-blue-100 transition rounded-md w-6' />
                 <span className="text-xs font-medium text-gray-600 truncate">{image ? image.name : "Browse"}</span>
                 <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
               </label>
             </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 mb-4 p-3.5 border border-indigo-100 bg-indigo-50/40 rounded-xl shrink-0'>
            <div className='flex flex-col gap-1 w-full'>
              <p className="font-semibold text-xs uppercase tracking-wide text-indigo-900">Retail Price</p>
              <input 
                 onChange={e => setCoursePrice(e.target.value)} value={isFreeCourse ? '' : coursePrice} 
                 type={isFreeCourse ? "text" : "number"} placeholder={isFreeCourse ? 'No Price' : 'Rs. 0'} 
                 className={`outline-none py-2 px-3 rounded-lg text-sm border transition shadow-sm w-full ${coursePrice === '' || coursePrice < 0 ? 'border-red-400' : 'border-indigo-200'} ${isFreeCourse ? 'bg-indigo-100/50 text-indigo-400 placeholder:text-indigo-400 cursor-not-allowed font-medium' : 'focus:ring-2 focus:ring-indigo-100 bg-white'}`} 
                 required={!isFreeCourse} disabled={isFreeCourse} 
              />
            </div>
            
            <div className='flex flex-col gap-1 w-full'>
              <p className="font-semibold text-xs uppercase tracking-wide text-indigo-900">Discount</p>
              <input 
                 onChange={e => setDiscount(e.target.value)} value={isFreeCourse ? '' : discount} 
                 type={isFreeCourse ? "text" : "number"} placeholder={isFreeCourse ? 'None' : '0%'} 
                 min={0} max={100} 
                 className={`outline-none py-2 px-3 rounded-lg text-sm border transition border-indigo-200 shadow-sm w-full ${isFreeCourse ? 'bg-indigo-100/50 text-indigo-400 placeholder:text-indigo-400 cursor-not-allowed font-medium' : 'focus:ring-2 focus:ring-indigo-100 bg-white'}`} 
                 required={!isFreeCourse} disabled={isFreeCourse} 
              />
            </div>

            <div className='flex flex-col items-center justify-center bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm shrink-0 w-32 hover:shadow-md transition'>
              <p className="font-bold text-[10px] uppercase tracking-wider text-green-600 mb-0.5">Free Lecture</p>
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input type="checkbox" className="sr-only peer" checked={isFreeCourse} onChange={(e) => {
                    setIsFreeCourse(e.target.checked);
                    if (e.target.checked) { setCoursePrice(0); setDiscount(0); }
                }} />
                <div className="w-[36px] h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
              </label>
            </div>
          </div>

          <button type="submit" className='bg-gray-900 text-white text-sm font-bold tracking-wide w-full py-3.5 rounded-xl shadow-md hover:bg-black hover:shadow-lg transition-all mt-auto shrink-0 mb-1'>
            PUBLISH COURSE
          </button>
        </div>

        {/* Right Column: Curriculum Builder */}
        <div className='w-full md:w-[40%] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative border-t-4 border-t-purple-500'>
          
          <div className='flex items-center justify-between gap-4 mb-6 p-3.5 border border-orange-100 bg-orange-50/40 rounded-xl shrink-0'>
             <div className='flex flex-col gap-1 w-full'>
               <p className="font-semibold text-xs uppercase tracking-wide text-orange-900">Course Expiration Limit</p>
               <input onChange={e => setCourseAccessDuration(e.target.value)} value={courseAccessDuration} type="number" placeholder='Lifetime' className='outline-none py-2 px-3 rounded-lg text-sm border border-orange-200 focus:ring-2 focus:ring-orange-100 transition w-full shadow-sm placeholder:text-gray-400' />
             </div>
             
             <div className='flex flex-col gap-1 w-32 shrink-0'>
               <p className="font-semibold text-xs uppercase tracking-wide text-orange-900">Unit</p>
               <select onChange={e => setCourseAccessUnit(e.target.value)} value={courseAccessUnit} className='outline-none py-2 px-3 rounded-lg text-sm border border-orange-200 bg-white focus:ring-2 focus:ring-orange-100 transition shadow-sm cursor-pointer'>
                  <option value="Minutes">Mins</option>
                  <option value="Hours">Hrs</option>
                  <option value="Days">Days</option>
                  <option value="Weeks">Wks</option>
                  <option value="Months">Mos</option>
               </select>
             </div>
          </div>

           <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4 shrink-0">
             <div>
               <h2 className="text-2xl font-bold text-gray-800">Curriculum</h2>
               <p className="text-xs text-gray-500 mt-1 font-medium">{chapters.length} Modules Arranged</p>
             </div>
             <button type="button" className="bg-purple-50 text-purple-600 border border-purple-200 px-4 py-2 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition text-sm font-semibold shadow-sm flex items-center gap-1.5" onClick={() => handleChapter('add')}>
                <span className="text-lg leading-none">+</span> Add Chapter
             </button>
           </div>
           
           <div className="overflow-y-auto pr-3 h-full space-y-4 pb-10">
             {chapters.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-56 text-gray-400 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                   <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                     <span className="text-xl">📚</span>
                   </div>
                   <p className="font-semibold text-gray-600">No curriculum uploaded</p>
                   <p className="text-xs mt-1 max-w-[200px] leading-relaxed">Start arranging chapters to map out the student experience.</p>
                </div>
             ) : (
               chapters.map((chapter, chapterIndex) => (
                 <div key={chapterIndex} className="bg-white border rounded-2xl shadow-sm overflow-hidden transition-all group">
                   <div className="flex justify-between items-center p-4 bg-gray-50/80 border-b border-gray-100">
                     <div className="flex items-center gap-3">
                       <div onClick={() => handleChapter('toggle', chapter.chapterId)} className="cursor-pointer p-1.5 bg-white shadow-sm border border-gray-200 hover:bg-gray-100 rounded-md transition-all">
                         <img className={`w-3 opacity-70 transition-transform duration-300 ${chapter.collapsed ? "-rotate-90" : "rotate-0"}`} src={assets.dropdown_icon} alt="Toggle" />
                       </div>
                       <span className="font-bold text-gray-800 text-sm">Chapter {chapterIndex + 1}: {chapter.chapterTitle}</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 bg-purple-100 px-2 py-1 rounded-md">{chapter.chapterContent.length} Lectures</span>
                       <button type="button" onClick={() => handleChapter('remove', chapter.chapterId)} className='p-1.5 hover:bg-red-50 rounded-md transition group-hover:opacity-100 opacity-0'>
                         <img src={assets.cross_icon} alt="Remove" className='w-3 invert opacity-60 hover:opacity-100' style={{ filter: "invert(0.5) sepia(1) saturate(5) hue-rotate(320deg)" }} />
                       </button>
                     </div>
                   </div>
                   {!chapter.collapsed && (
                     <div className="p-3 bg-white">
                        {chapter.chapterContent.map((lecture, lectureIndex) => (
                          <div key={lectureIndex} className="flex justify-between items-center p-2.5 mb-2 bg-gray-50/50 border border-gray-100 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition group/lecture">
                             <div className="flex flex-col max-w-[85%] gap-0.5">
                               <span className="text-sm font-semibold text-gray-700 truncate">{lectureIndex + 1}. {lecture.lectureTitle}</span>
                               <span className="text-xs text-gray-500 flex gap-2.5 items-center">
                                  <span className="flex items-center gap-1 font-medium"><img src={assets.time_clock_icon} className="w-3 opacity-50" /> {lecture.lectureDuration}m</span>
                                  {lecture.isPreviewFree && <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center text-[9px] font-bold uppercase tracking-wider">Free</span>}
                                  <a href={lecture.lectureUrl} target="_blank" className="text-blue-500 hover:text-blue-700 hover:underline font-medium">Link</a>
                               </span>
                             </div>
                             <button type="button" onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} className='p-1.5 hover:bg-red-50 rounded-md transition opacity-0 group-hover/lecture:opacity-100'>
                                <img src={assets.cross_icon} alt="Remove" className='w-2.5 opacity-60' />
                             </button>
                          </div>
                        ))}
                       <button type="button" className="w-full mt-2 border border-dashed border-gray-300 text-gray-500 hover:text-purple-600 hover:border-purple-400 hover:bg-purple-50/50 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 shadow-sm" onClick={() => handleLecture('add', chapter.chapterId)}>
                         <span className="text-lg leading-none">+</span> Add Lecture Object
                       </button>
                     </div>
                   )}
                 </div>
               ))
             )}
           </div>
        </div>

          {/* Add Chapter Modal */}
          {showChapterPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 p-4 transition-all">
              <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm relative border border-gray-100/50">
                <button type="button" onClick={() => setShowChapterPopup(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition text-gray-500 bg-gray-50">
                  <img src={assets.cross_icon} className='w-3 opacity-60' alt="Close" />
                </button>
                
                <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                   <span className="bg-blue-50 text-blue-600 p-1.5 rounded-lg text-sm leading-none">📁</span> Add New Chapter
                </h2>
                
                <div className="mb-5">
                  <p className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Chapter Title</p>
                  <input type="text" className="w-full border border-gray-200 rounded-xl py-2.5 px-4 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition shadow-sm text-sm text-gray-800 placeholder:text-gray-400" placeholder="e.g. Introduction to React" value={chapterTitleInput} onChange={(e) => setChapterTitleInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addChapter()} autoFocus />
                </div>
                
                <button type='button' disabled={!chapterTitleInput.trim()} className="w-full bg-blue-600 text-white text-sm font-bold tracking-wide py-3 rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-blue-600/20 disabled:bg-blue-300 disabled:shadow-none disabled:cursor-not-allowed" onClick={addChapter}>
                  ADD CHAPTER
                </button>
              </div>
            </div>
          )}

        {/* Add Lecture Modal */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm z-50 p-4 transition-all">
            <div className="bg-white p-7 rounded-3xl shadow-2xl w-full max-w-sm relative transform scale-100 transition-all border border-gray-100">
              <button type="button" onClick={() => setShowPopup(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition text-gray-500 bg-gray-50">
                <img src={assets.cross_icon} className='w-3 opacity-60' alt="Close" />
              </button>
              
              <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                 <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg text-sm leading-none">▶</span> New Lecture
              </h2>
              
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Lecture Title</label>
                <input type="text" className="w-full border border-gray-300 rounded-xl py-2.5 px-4 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition shadow-sm font-medium text-gray-800" placeholder="e.g. Overview" value={lectureDetails.lectureTitle} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })} autoFocus />
              </div>
              
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">YouTube Video URL</label>
                <input type="text" className="w-full border border-gray-300 rounded-xl py-2.5 px-4 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition shadow-sm font-medium text-gray-800" placeholder="https://youtube.com/watch?v=..." value={lectureDetails.lectureUrl} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })} />
                {lectureDetails.lectureUrl && (
                  <div className="mt-3 p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-2 shadow-sm">
                    <img src={assets.time_clock_icon} className="w-4 opacity-80 mix-blend-multiply" alt="duration" />
                    <span className="text-sm font-semibold text-blue-800">
                      Duration: {lectureDetails.lectureDuration ? `${lectureDetails.lectureDuration} mins` : <span className="animate-pulse text-blue-500">Extracting data...</span>}
                    </span>
                    <div className="absolute w-0 h-0 overflow-hidden opacity-0">
                      <YouTube 
                        videoId={lectureDetails.lectureUrl.split('/').pop().split('?v=').pop().split('?')[0].split('&')[0]} 
                        onReady={(e) => {
                          const durationMinutes = Math.ceil(e.target.getDuration() / 60);
                          setLectureDetails(prev => ({...prev, lectureDuration: durationMinutes}));
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-8 p-3.5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                <span className="text-sm font-bold text-gray-700">Display as Free Preview?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={lectureDetails.isPreviewFree} onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                </label>
              </div>
              
              <button type='button' disabled={!lectureDetails.lectureDuration || !lectureDetails.lectureTitle} className="w-full bg-blue-600 text-white font-bold tracking-wide py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 disabled:bg-blue-300 disabled:shadow-none disabled:cursor-not-allowed" onClick={addLecture}>
                UPLOAD LECTURE
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddCourse;