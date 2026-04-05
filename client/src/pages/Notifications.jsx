import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Card from '../components/Card';
import { Bell } from 'lucide-react';

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

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Notifications</h1>
            </div>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', background: 'var(--surface)' }}>
                <select className="input-field" value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: '300px' }}>
                    <option value="">All Notifications</option>
                    <option value="Club">Clubs</option>
                    <option value="Event">Events</option>
                    <option value="Sport">Sports</option>
                    <option value="General">General</option>
                </select>
            </div>

            <div className="grid grid-cols-1">
                {notifications.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No notifications available.</p> : notifications.map(notif => (
                    <Card key={notif._id} title={notif.title} subtitle={new Date(notif.createdAt).toLocaleString()} icon={Bell}>
                        <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', background: 'var(--primary)', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'white' }}>{notif.relatedArea}</span>
                        <p>{notif.message}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
