import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const StudentsEnrolled = () => {

  const { backendUrl, getToken, isEducator } = useContext(AppContext)

  const [enrolledStudents, setEnrolledStudents] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = enrolledStudents?.filter(item => 
    item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse())
      } else {
        toast.error(data.message)
        setEnrolledStudents([])
      }

    } catch (error) {
      toast.error(error.message)
      setEnrolledStudents([])
    }
  }

  useEffect(() => {
    if (getToken) {
      fetchEnrolledStudents()
    }
  }, [getToken])

  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col items-start justify-start md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className='w-full max-w-4xl mb-6'>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Enrolled Students</h2>
        <div className="relative group">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by student name, email, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 shadow-sm"
          />
        </div>
      </div>
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 ">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {filteredStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-500/20 hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <img
                    src={item.student.imageUrl}
                    alt=""
                    className="w-9 h-9 rounded-full border border-slate-200"
                  />
                  <span className="truncate font-medium text-slate-800">{item.student.name === 'null null' ? item.student.email : item.student.name}</span>
                </td>
                <td className="px-4 py-3 truncate text-slate-600">{item.courseTitle}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-slate-500">{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="4" className="py-12 text-center text-slate-400 font-medium italic">
                  No matching students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
};

export default StudentsEnrolled;