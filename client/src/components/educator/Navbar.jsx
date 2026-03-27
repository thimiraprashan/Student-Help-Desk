import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { UserButton, useUser } from '@clerk/clerk-react';

const Navbar = ({ bgColor }) => {

  const { isEducator } = useContext(AppContext)
  const { user } = useUser()

  return isEducator && user && (
    <nav className={`sticky top-0 z-50 w-full flex items-center justify-between px-6 md:px-10 border-b border-gray-200/50 py-4 bg-white/80 backdrop-blur-md shadow-[0_2px_4px_-1px_rgba(0,0,0,0.05)] transition-all duration-300 ${bgColor || ''}`}>
      <Link to="/" className="flex items-center">
        <img src={assets.chatimg} alt="Logo" className="h-10 lg:h-12 w-auto cursor-pointer transition-transform duration-300 hover:scale-105 object-contain" />
      </Link>
      <div className="flex items-center gap-5 text-gray-600 font-medium">
        <div className="hidden sm:flex items-center bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200 shadow-inner">
           <span className="text-xs text-gray-500 mr-2 border-r border-gray-300 pr-2">Educator</span>
           <p className="text-sm text-gray-800">Hi, {user.fullName}</p>
        </div>
        <div className="scale-110 hover:scale-125 transition-transform duration-300 ml-2">
           <UserButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;