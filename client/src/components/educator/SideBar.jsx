import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const SideBar = () => {

  const { isEducator } = useContext(AppContext)

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-200/50 bg-white/50 backdrop-blur-sm pt-5 px-2 flex flex-col shadow-[2px_0_10px_-3px_rgba(0,0,0,0.02)]'>
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === '/educator'}
          className={({ isActive }) =>
            `flex items-center md:flex-row flex-col md:justify-start justify-center py-3 md:px-6 mb-2 mx-1 rounded-xl transition-all duration-300 group ${isActive
              ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
            }`
          }
        >
          <img src={item.icon} alt="" className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 opacity-80 ${window.location.pathname === item.path ? 'opacity-100 brightness-75' : ''}`} />
          <p className='md:block hidden font-medium'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;