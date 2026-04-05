import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Trophy, Users, Bell } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2 style={{ color: 'var(--text-main)', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 700 }}>SLIIT<span style={{ color: 'var(--primary)' }}>LMS</span></h2>
            <div className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                    <Home size={20} /> Home
                </NavLink>
                <NavLink to="/events" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Calendar size={20} /> Events
                </NavLink>
                <NavLink to="/sports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Trophy size={20} /> Sports
                </NavLink>
                <NavLink to="/clubs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} /> Clubs & Societies
                </NavLink>
                <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Bell size={20} /> Notifications
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
