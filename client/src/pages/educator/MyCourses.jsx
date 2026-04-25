import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {

  const { backendUrl, isEducator, currency, getToken, calculateRating } = useContext(AppContext)
  const navigate = useNavigate()

  const [courses, setCourses] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)

  const handleDeleteCourse = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.delete(backendUrl + '/api/educator/delete-course/' + courseToDelete, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
         toast.success(data.message)
         setCourses(courses.filter(course => course._id !== courseToDelete))
      } else {
         toast.error(data.message)
      }
    } catch (error) {
       toast.error(error.message)
    }
    setShowDeleteModal(false)
    setCourseToDelete(null)
  }

  const fetchEducatorCourses = async () => {

    try {

      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/courses', { headers: { Authorization: `Bearer ${token}` } })

      data.success ? setCourses(data.courses) : setCourses([])

    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (getToken) {
      fetchEducatorCourses()
    }
  }, [getToken])

  return courses ? (
    <div className="h-screen flex flex-col items-start justify-start md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className='w-full'>
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-auto w-full overflow-x-auto">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate text-center">Rating</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
                <th className="px-4 py-3 font-semibold truncate">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img src={course.courseThumbnail} alt="Course Image" className="w-16" />
                    <span className="truncate hidden md:block">{course.courseTitle}</span>
                  </td>
                  <td className="px-4 py-3">{currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}</td>
                  <td className="px-4 py-3">{course.enrolledStudents.length}</td>
                  <td className="px-4 py-3 text-center">
                     <div className="flex items-center justify-center gap-1">
                       <span className="font-bold text-slate-700">{calculateRating(course)}</span>
                       <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                       </svg>
                     </div>
                   </td>
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button onClick={() => navigate('/educator/edit-course/' + course._id)} className='text-blue-500 hover:text-blue-700' title="Edit Course">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onClick={() => { setShowDeleteModal(true); setCourseToDelete(course._id); }} className='text-red-500 hover:text-red-700' title="Delete Course">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-6 text-gray-800">Are you sure you want to delete this course?</h3>
            <div className="flex justify-center gap-4">
              <button onClick={handleDeleteCourse} className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes</button>
              <button onClick={() => { setShowDeleteModal(false); setCourseToDelete(null); }} className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">No</button>
            </div>
          </div>
        </div>
      )}

    </div>
  ) : <Loading />
};

export default MyCourses;