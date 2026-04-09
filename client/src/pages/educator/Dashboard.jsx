import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const Dashboard = () => {

  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext)

  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {

      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/dashboard',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
        // Fallback to prevent infinite loading on backend failure
        setDashboardData({ enrolledStudentsData: [], totalCourses: 0, totalEarnings: 0 })
      }

    } catch (error) {
      toast.error(error.message)
      setDashboardData({ enrolledStudentsData: [], totalCourses: 0, totalEarnings: 0 })
    }
  }

  useEffect(() => {

    if (isEducator) {
      fetchDashboardData()
    }

  }, [isEducator])

  const studentsData = [
    {
      id: 1,
      name: 'Richard Sanford',
      profileImage: assets.profile_img,
      courseTitle: 'Build Text to Image SaaS App in React JS',
      date: '22 Aug, 2024'
    },
    {
      id: 2,
      name: 'Enrique Murphy',
      profileImage: assets.profile_img2,
      courseTitle: 'Build Text to Image SaaS App in React JS',
      date: '22 Aug, 2024'
    },
    {
      id: 3,
      name: 'Alison Powell',
      profileImage: assets.profile_img3,
      courseTitle: 'Build Text to Image SaaS App in React JS',
      date: '22 Aug, 2024'
    },
    {
      id: 4,
      name: 'Richard Sanford',
      profileImage: assets.profile_img,
      courseTitle: 'Build Text to Image SaaS App in React JS',
      date: '22 Aug, 2024'
    },
    {
      id: 5,
      name: 'Enrique Murphy',
      profileImage: assets.profile_img2,
      courseTitle: 'Build Text to Image SaaS App in React JS',
      date: '22 Aug, 2024'
    },
    {
      id: 6,
      name: 'Alison Powell',
      profileImage: assets.profile_img3,
      courseTitle: 'Build Text to Image SaaS App in React JS',
      date: '22 Aug, 2024'
    }
  ];


  return dashboardData ? (
    <div className='min-h-[calc(100vh-80px)] flex flex-col items-start justify-between gap-8 md:p-10 p-4 pt-8 w-full'>
      <div className='space-y-8 w-full max-w-6xl'>
        <div className='flex flex-wrap gap-6 items-center'>
          <div className='flex items-center gap-5 bg-white shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 p-6 w-full sm:w-64 rounded-2xl'>
            <div className='p-3.5 bg-blue-50 rounded-xl'>
               <img src={assets.patients_icon} alt="patients_icon" className='w-8 h-8 opacity-80' />
            </div>
            <div>
              <p className='text-3xl font-bold text-gray-800'>{dashboardData.enrolledStudentsData.length}</p>
              <p className='text-sm font-medium text-gray-500 mt-1'>Total Enrolments</p>
            </div>
          </div>
          <div className='flex items-center gap-5 bg-white shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 p-6 w-full sm:w-64 rounded-2xl'>
            <div className='p-3.5 bg-green-50 rounded-xl'>
               <img src={assets.appointments_icon} alt="patients_icon" className='w-8 h-8 opacity-80' />
            </div>
            <div>
              <p className='text-3xl font-bold text-gray-800'>{dashboardData.totalCourses}</p>
              <p className='text-sm font-medium text-gray-500 mt-1'>Total Courses</p>
            </div>
          </div>
          <div className='flex items-center gap-5 bg-white shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 p-6 w-full sm:w-64 rounded-2xl'>
            <div className='p-3.5 bg-purple-50 rounded-xl'>
               <img src={assets.earning_icon} alt="patients_icon" className='w-8 h-8 opacity-80' />
            </div>
            <div>
              <p className='text-3xl font-bold text-gray-800'>{currency}{Math.floor(dashboardData.totalEarnings)}</p>
              <p className='text-sm font-medium text-gray-500 mt-1'>Total Earnings</p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="pb-4 text-xl font-bold text-gray-800">Latest Enrolments</h2>
          <div className="flex flex-col max-w-4xl w-full overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 text-left">
                <tr>
                  <th className="px-6 py-4 font-semibold text-center hidden sm:table-cell">#</th>
                  <th className="px-6 py-4 font-semibold">Student Name</th>
                  <th className="px-6 py-4 font-semibold">Course Title</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-center hidden sm:table-cell font-medium text-gray-500">{index + 1}</td>
                    <td className="md:px-6 px-4 py-4 flex items-center space-x-4">
                      <img
                        src={item.student.imageUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border border-gray-200 shadow-sm object-cover"
                      />
                      <span className="truncate font-medium text-gray-800">{item.student.name === 'null null' ? item.student.email : item.student.name}</span>
                    </td>
                    <td className="px-6 py-4 truncate text-gray-600">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : <Loading />
};

export default Dashboard;