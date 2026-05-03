import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, Trophy, Users, Bell, ShieldCheck, LogOut, ClipboardCheck } from 'lucide-react';
import API from '../utils/api.js';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

const Sidebar = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const { mode, coordinatorType, login, logout } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginData, setLoginData] = useState({ type: 'Event', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (login(loginData.type, loginData.password)) {
            setIsLoginModalOpen(false);
            setLoginData({ ...loginData, password: '' });
            setError('');

            // Redirect based on type
            if (loginData.type === 'Event') navigate('/events');
            if (loginData.type === 'Sport') navigate('/sports');
            if (loginData.type === 'Club') navigate('/clubs');
        } else {
            setError('Invalid credentials');
        }
    };

    const isAuthorized = (targetType) => {
        if (mode !== 'coordinator') return true;
        return coordinatorType === targetType;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header" style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
                <h2 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>SLIIT<span style={{ color: 'var(--primary)' }}>LMS</span></h2>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Extra-Curricular Portal</p>
            </div>
            <div className="sidebar-nav" style={{ flex: 1 }}>
                <NavLink to="/extra-curricular" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                    <Home size={20} /> Home
                </NavLink>

                {isAuthorized('Event') && (
                    <NavLink to="/events" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Calendar size={20} /> Events
                    </NavLink>
                )}

                {isAuthorized('Sport') && (
                    <NavLink to="/sports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Trophy size={20} /> Sports
                    </NavLink>
                )}

                {isAuthorized('Club') && (
                    <NavLink to="/clubs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Users size={20} /> Clubs & Societies
                    </NavLink>
                )}

                <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
                    <Bell size={20} /> Notifications
                    {unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </NavLink>

                <NavLink to="/testing" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <ClipboardCheck size={20} /> Quality Assurance
                </NavLink>
            </div>

            <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
                {mode === 'coordinator' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <ShieldCheck size={20} color="var(--primary)" />
                            <div>
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{coordinatorType} Coord.</p>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--primary)' }}>Admin Mode</p>
                            </div>
                        </div>
                        <button className="nav-item" onClick={logout} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: 'var(--danger)' }}>
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                ) : (
                    <button className="nav-item" onClick={() => setIsLoginModalOpen(true)} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                        <ShieldCheck size={20} /> Coordinator Login
                    </button>
                )}
            </div>

            <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="Coordinator Sign-in">
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Coordinator Type</label>
                        <select className="input-field" value={loginData.type} onChange={e => setLoginData({ ...loginData, type: e.target.value })}>
                            <option value="Event">Event Coordinator</option>
                            <option value="Sport">Sport Coordinator</option>
                            <option value="Club">Club Coordinator</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Password</label>
                        <input className="input-field" type="password" placeholder="Enter password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
                    </div>
                    {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Sign In</button>
                </form>
            </Modal>
        </div>
    );
};

export default Sidebar;
