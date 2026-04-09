import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalIcon, MapPin, Clock } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', category: '', description: '', startDate: '', venue: '', image: '', ticketPrice: 0 });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

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
        if (confirm('Are you sure?')) {
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
        <div>
            <div className="page-header">
                <h1 className="page-title">Events</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Event</button>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '280px 1fr', marginBottom: '2rem' }}>
                <div className="card" style={{ background: 'var(--surface)', padding: '0.75rem', maxWidth: '280px' }}>
                    <h3 style={{ color: 'var(--text-main)', marginTop: 0, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Event Calendar</h3>
                    <Calendar value={new Date()} className="custom-calendar compact-calendar" tileClassName={tileClassName} />
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-main)', marginTop: 0 }}>Search & Filter</h3>
                    <input className="input-field" placeholder="Search events alphabetically..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ marginBottom: '1rem' }} />
                    <select className="input-field" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Social">Social</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2">
                {filteredEvents.map(event => (
                    <Card 
                        key={event._id} 
                        style={{ padding: '1.25rem' }}
                        image={event.image}
                        actions={
                            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end' }}>
                                <button className="btn" style={{ background: 'var(--surface-hover)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => { setFormData({ ...event, startDate: event.startDate ? event.startDate.split('T')[0] : '' }); setEditingId(event._id); setIsModalOpen(true); }}>Update</button>
                                <button className="btn" style={{ background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleDelete(event._id)}>Delete</button>
                            </div>
                        }
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <h3 style={{ margin: '0', color: 'var(--primary)', fontSize: '1.15rem' }}>{event.title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '0.9rem' }}><MapPin size={14} /> {event.venue}</p>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '0.9rem' }}><Clock size={14} /> {event.startDate ? new Date(event.startDate).toLocaleString() : 'TBD'}</p>
                            </div>
                            <p style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', width: 'fit-content', fontWeight: '500' }}>{event.category}</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Events Gallery</h2>
            <div className="grid grid-cols-3">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEj3Frpjh2riiyg83eKz3n95kJHt3AWsLyZw&s" alt="Gallery 1" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); setFormData({ title: '', category: '', description: '', startDate: '', venue: '', image: '', ticketPrice: 0 }) }} title={editingId ? 'Update Event' : 'Add Event'}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className="input-field" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                        <option value="">Select Category</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Social">Social</option>
                    </select>
                    <textarea className="input-field" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    <input className="input-field" type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                    <input className="input-field" placeholder="Venue" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} required />
                    <input className="input-field" placeholder="Image URL (Optional)" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>{editingId ? 'Update' : 'Submit'}</button>
                </form>
            </Modal>
        </div>
    );
};

export default Events;
