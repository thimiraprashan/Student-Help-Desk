import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Trophy, Users, Bell } from 'lucide-react';
import API from '../utils/api.js';

const Sidebar = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const { data } = await API.get('/notifications/unread-count');
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="sidebar">
            <h2 style={{ color: 'var(--text-main)', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 700 }}>SLIIT<span style={{ color: 'var(--primary)' }}>LMS</span></h2>
            <div className="sidebar-nav">
                <NavLink to="/extra-curricular" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
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
                <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
                    <Bell size={20} /> Notifications
                    {unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
