import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Card from '../components/Card';
import { Bell, Info, AlarmClock, PartyPopper, CheckCheck } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('');

    const fetchNotifications = async () => {
        try {
            const url = filter ? `/notifications?area=${filter}` : '/notifications';
            const res = await API.get(url).catch(() => ({ data: [] }));
            setNotifications(res.data || []);
        } catch (err) { }
    };

    useEffect(() => { fetchNotifications(); }, [filter]);

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) { console.error(err); }
    };

    const markAllAsRead = async () => {
        try {
            await API.put('/notifications/read-all');
            fetchNotifications();
        } catch (err) { console.error(err); }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'reminder': return AlarmClock;
            case 'celebration': return PartyPopper;
            default: return Info;
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'reminder': return '#f59e0b'; // Amber
            case 'celebration': return '#ec4899'; // Pink
            default: return 'var(--primary)';
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Notifications</h1>
                <button
                    className="btn"
                    style={{ background: 'var(--surface)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={markAllAsRead}
                >
                    <CheckCheck size={18} /> Mark all as read
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', background: 'var(--surface)', flexDirection: 'row', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter by Area:</span>
                <select className="input-field" value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: '200px', margin: 0 }}>
                    <option value="">All Notifications</option>
                    <option value="Club">Clubs</option>
                    <option value="Event">Events</option>
                    <option value="Sport">Sports</option>
                    <option value="General">General</option>
                </select>
            </div>

            <div className="grid grid-cols-1">
                {notifications.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No notifications available yet.</p>
                    </div>
                ) : notifications.map(notif => (
                    <div
                        key={notif._id}
                        onClick={() => !notif.isRead && markAsRead(notif._id)}
                        style={{ cursor: notif.isRead ? 'default' : 'pointer' }}
                    >
                        <Card
                            title={notif.title}
                            subtitle={new Date(notif.createdAt).toLocaleString()}
                            icon={getIcon(notif.type)}
                            className={notif.isRead ? '' : 'unread-notification'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ display: 'inline-block', padding: '0.25rem 0.6rem', background: getIconColor(notif.type), borderRadius: '4px', fontSize: '0.75rem', marginBottom: '0.5rem', color: 'white', fontWeight: 600 }}>
                                    {notif.relatedArea}
                                </span>
                                {!notif.isRead && <span className="unread-dot"></span>}
                            </div>
                            <p style={{ margin: 0, color: notif.isRead ? 'var(--text-muted)' : 'var(--text-main)' }}>{notif.message}</p>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
