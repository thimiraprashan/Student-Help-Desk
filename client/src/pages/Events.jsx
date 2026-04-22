import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalIcon, MapPin, Clock, Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', category: '', description: '', startDate: '', venue: '', image: '', ticketPrice: 0 });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const { mode, coordinatorType } = useAuth();

    const isEventCoordinator = mode === 'coordinator' && coordinatorType === 'Event';

    const fetchEvents = async () => {
        try {
            const res = await API.get('/events').catch(() => ({ data: [] }));
            setEvents(res.data || []);
        } catch (err) { }
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/events/${editingId}`, formData);
            } else {
                await API.post('/events', formData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ title: '', category: '', description: '', startDate: '', venue: '', image: '', ticketPrice: 0 });
            fetchEvents();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this event?')) {
            await API.delete(`/events/${id}`);
            fetchEvents();
        }
    };

    const filteredEvents = events.filter(e => {
        return (
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterCategory ? e.category === filterCategory : true)
        );
    }).sort((a, b) => a.title.localeCompare(b.title));

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const hasEvent = events.some(e => new Date(e.startDate).toDateString() === date.toDateString());
            return hasEvent ? 'highlight-event' : null;
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>University Events</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Explore and participate in campus activities</p>
                </div>
                {isEventCoordinator && (
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> Add Event
                    </button>
                )}
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '8px', color: 'white' }}><Search size={20} /></div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Find Events</h3>
                        </div>
                        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="input-field" placeholder="Search events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: '2.75rem' }} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <select className="input-field" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ paddingLeft: '2.75rem' }}>
                                    <option value="">All Categories</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Social">Social</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Upcoming Events List
                        </h2>
                        <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map(event => (
                                    <Card
                                        key={event._id}
                                        image={event.image || 'https://images.unsplash.com/photo-1540575861501-7ad05823c93e?auto=format&fit=crop&q=80&w=800'}
                                        actions={isEventCoordinator ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end' }}>
                                                <button className="btn" style={{ background: 'var(--surface-hover)', color: 'var(--text-main)', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => { setFormData({ ...event, startDate: event.startDate ? event.startDate.split('T')[0] : '' }); setEditingId(event._id); setIsModalOpen(true); }}>Update</button>
                                                <button className="btn" style={{ background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleDelete(event._id)}>Delete</button>
                                            </div>
                                        ) : null}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <p style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{event.category}</p>
                                                <h3 style={{ margin: '0', color: 'var(--text-main)', fontSize: '1.25rem', lineHeight: '1.4' }}>{event.title}</h3>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                    <MapPin size={16} color="var(--primary)" />
                                                    <span style={{ fontWeight: 500 }}>{event.venue}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                    <Clock size={16} color="var(--primary)" />
                                                    <span style={{ fontWeight: 500 }}>{event.startDate ? new Date(event.startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD'}</span>
                                                </div>
                                            </div>

                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {event.description}
                                            </p>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem' }}>
                                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>No events found matches your criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ background: 'var(--surface)', padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '0.5rem', background: 'var(--secondary)', borderRadius: '8px', color: 'white' }}><CalIcon size={20} /></div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Event Calendar</h3>
                        </div>
                        <Calendar value={new Date()} className="custom-calendar full-calendar" tileClassName={tileClassName} />
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginRight: '0.5rem' }}></span>
                                Highlighted dates have scheduled events
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '1.75rem', fontWeight: 800 }}>Events Gallery</h2>
                <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                    <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', height: '250px' }}>
                        <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600" alt="Gallery 1" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'} />
                    </div>
                    <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', height: '250px' }}>
                        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600" alt="Gallery 2" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'} />
                    </div>
                    <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', height: '250px' }}>
                        <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600" alt="Gallery 3" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'} />
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); setFormData({ title: '', category: '', description: '', startDate: '', venue: '', image: '', ticketPrice: 0 }) }} title={editingId ? 'Update Event' : 'Add New Event'}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Event Title</label>
                            <input className="input-field" placeholder="Graduation 2024" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
                            <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                                <option value="">Select Category</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Seminar">Seminar</option>
                                <option value="Social">Social</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
                        <textarea className="input-field" placeholder="Describe what the event is about..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={{ minHeight: '100px' }} />
                    </div>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Date</label>
                            <input className="input-field" type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Venue</label>
                            <input className="input-field" placeholder="Main Auditorium" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} required />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Banner Image URL</label>
                        <input className="input-field" placeholder="https://example.com/image.jpg" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>{editingId ? 'Update Event' : 'Publish Event'}</button>
                </form>
            </Modal>
        </div>
    );
};

export default Events;
