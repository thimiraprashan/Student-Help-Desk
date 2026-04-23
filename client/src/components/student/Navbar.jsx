import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '../../lib/auth.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const NavLink = ({ to, label, isActive, isGradient }) => (
  <Link
    to={to}
    className={`relative group px-1 py-2 font-bold text-[15px] transition-colors duration-300
      ${isActive ? 'text-slate-950' : 'text-slate-600 hover:text-slate-950'}`}
  >
    {isGradient ? (
      <span className="flex items-center gap-2 px-5 py-3 rounded-[9px] bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_8px_20px_rgba(91,76,226,0.25)] hover:shadow-md transition-all hover:-translate-y-0.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        {label}
      </span>
    ) : (
      <>
        {label}
      </>
    )}
  </Link>
);

const Navbar = () => {
  const location = useLocation();
  const { backendUrl, isEducator, setIsEducator, navigate, getToken } = useContext(AppContext)
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return;
      }
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        setIsEducator(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Kuppi Sessions', path: '/kuppi-sessions' },
    { label: 'Industry Placement', path: '/industry-placement' },
    { label: 'Extra Curricular', path: '/extra-curricular' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full font-sans bg-white border-b border-slate-200/70 shadow-[0_4px_12px_rgba(15,35,65,0.09)] transition-all duration-300">
      <div className="w-full px-5 sm:px-8 lg:px-[52px]">
        <div className="flex justify-between items-center h-20">

          {/* Logo - Far Left */}
          <div className="flex-shrink-0 flex items-center">
            <img onClick={() => navigate('/')} src={assets.chatimg} alt="Student Help Desk" className="h-[58px] lg:h-[62px] w-auto cursor-pointer transition-transform hover:scale-[1.02] object-contain" />
          </div>

          {/* Primary Navigation - Center/Right */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                label={item.label}
                isActive={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
              />
            ))}
            <NavLink
              to="/help"
              label="AI Chat Bot"
              isActive={location.pathname.startsWith('/help')}
              isGradient={true}
            />
          </div>

          {/* Secondary Actions - Far Right */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <button onClick={becomeEducator} className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                  {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                </button>
                <Link to='/my-enrollments' className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">My Enrollments</Link>
                <div className="pl-2 border-l border-gray-300">
                  <UserButton />
                </div>
              </div>
            ) : (
              <button onClick={() => openSignIn()} className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-[9px] shadow-[0_8px_20px_rgba(37,99,235,0.22)] hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
                </svg>
                Sign In / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            {user && <span className="mr-4"><UserButton /></span>}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-blue-600 transition-colors focus:outline-none">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-b border-gray-200">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-semibold transition-colors ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-3 text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            >
              ✨ AI Chat Bot
            </Link>
            <hr className="my-2 border-gray-200" />
            {!user ? (
              <button onClick={() => { openSignIn(); setMobileMenuOpen(false); }} className="w-full mt-2 bg-blue-600 text-white font-semibold px-4 py-3 rounded-md">
                Sign In / Sign Up
              </button>
            ) : (
              <>
                <button onClick={() => { becomeEducator(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-md font-semibold">
                  {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                </button>
                <Link to='/my-enrollments' onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-md font-semibold">
                  My Enrollments
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
