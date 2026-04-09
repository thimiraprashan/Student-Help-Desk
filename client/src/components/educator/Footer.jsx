import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer style={{ width: '100%', boxSizing: 'border-box' }}
      className="flex md:flex-row flex-col-reverse items-center justify-between text-left px-8 py-3 border-t border-gray-200 bg-white"
    >
      <div className='flex items-center gap-4'>
        <img className='hidden md:block w-16' src={assets.chatimg} alt="logo" />
        <div className='hidden md:block h-6 w-px bg-gray-300'></div>
        <p className="text-xs md:text-sm text-gray-500">
          Copyright 2026 © Student Help Desk. All Rights Reserved.
        </p>
      </div>
      <div className='flex items-center gap-3 max-md:mt-4'>
        <a href="#" aria-label="Facebook">
          <img src={assets.facebook_icon} alt="facebook" className="w-5 h-5" />
        </a>
        <a href="#" aria-label="Twitter">
          <img src={assets.twitter_icon} alt="twitter" className="w-5 h-5" />
        </a>
        <a href="#" aria-label="Instagram">
          <img src={assets.instagram_icon} alt="instagram" className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;