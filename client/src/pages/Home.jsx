import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import Card from '../components/Card';
import { Calendar, Trophy, Users, Bell, Upload } from 'lucide-react';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [sports, setSports] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await API.post('/upload', formData, config);
            // In a real app, we might want to refresh the gallery or add to it
            alert('Image uploaded successfully! Path: ' + data);
            window.location.reload(); // Refresh to see gallery update if linked to backend
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [evRes, spRes, clRes, noRes] = await Promise.all([
                    API.get('/events').catch(() => ({ data: [] })),
                    API.get('/sports').catch(() => ({ data: [] })),
                    API.get('/clubs').catch(() => ({ data: [] })),
                    API.get('/notifications').catch(() => ({ data: [] }))
                ]);
                setEvents(evRes.data.slice(0, 3));
                setSports(spRes.data.slice(0, 3));
                setClubs(clRes.data.slice(0, 3));
                setNotifications(noRes.data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="page-content">Loading...</div>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Extracurricular Activities</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>

                </div>
            </div>

            {/* Notifications Widget */}
            <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--secondary)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                    <Bell size={20} color="var(--secondary)" /> Recent Notifications
                </h3>
                {notifications.length === 0 ? <p>No new notifications</p> : (
                    <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                        {notifications.map(n => (
                            <li key={n._id} style={{ marginBottom: '0.5rem' }}>
                                <strong style={{ color: 'var(--primary)' }}>[{n.relatedArea}]</strong> {n.title} - {n.message}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="grid grid-cols-3">
                <Link to="/events" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <Card title="Upcoming Events" icon={Calendar}>
                        {events.length === 0 ? <p>No events found.</p> : events.map(e => <p key={e._id}>{e.title}</p>)}
                    </Card>
                </Link>

                <Link to="/sports" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <Card title="Popular Sports" icon={Trophy}>
                        {sports.length === 0 ? <p>No sports found.</p> : sports.map(s => <p key={s._id}>{s.name}</p>)}
                    </Card>
                </Link>

                <Link to="/clubs" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <Card title="Active Clubs" icon={Users}>
                        {clubs.length === 0 ? <p>No clubs found.</p> : clubs.map(c => <p key={c._id}>{c.name}</p>)}
                    </Card>
                </Link>
            </div>

            <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Gallery</h2>
            <div className="grid grid-cols-3">
                <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800" alt="Concert Gallery" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <img src="https://images.unsplash.com/photo-1599982946086-eb42d9e14eb8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3JpY2tldCUyMHBsYXllcnxlbnwwfHwwfHx8MA%3D%3D" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=400" alt="Gallery 3" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />

                <img src="https://images.unsplash.com/photo-1734467358727-1061f433212d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hlc3MlMjBwbGF5ZXJ8ZW58MHx8MHx8fDA%3D" alt="Gallery 2" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <img src="https://images.unsplash.com/photo-1740065592671-9cb593ee9b78?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHVuaXZlcnNpdHklMjBldmVudHN8ZW58MHx8MHx8fDA%3D" alt="Gallery 3" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
            </div>
        </div>
    );
};

export default Home;
