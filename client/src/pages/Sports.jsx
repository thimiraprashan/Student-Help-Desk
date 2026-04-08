import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Trophy } from 'lucide-react';

const Sports = () => {
    const [sports, setSports] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', type: 'Individual', category: 'Outdoor', image: '' });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestData, setRequestData] = useState({ studentName: '', studentId: '', reason: '' });
    const [selectedSportId, setSelectedSportId] = useState(null);

    const fetchSports = async () => {
        try {
            const res = await API.get('/sports').catch(() => ({ data: [] }));
            setSports(res.data || []);
        } catch (err) { }
    };

    useEffect(() => { fetchSports(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/sports/${editingId}`, formData);
            } else {
                await API.post('/sports', formData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ name: '', description: '', type: 'Individual', category: 'Outdoor', image: '' });
            fetchSports();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            await API.delete(`/sports/${id}`);
            fetchSports();
        }
    };

    const filteredSports = sports.filter(s => {
        return (
            (s.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filterType ? s.type === filterType : true) &&
            (filterCategory ? s.category === filterCategory : true)
        );
    }).sort((a, b) => a.name.localeCompare(b.name));

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/sports/${selectedSportId}/request`, requestData);
            alert('Request submitted successfully!');
            setIsRequestModalOpen(false);
            setRequestData({ studentName: '', studentId: '', reason: '' });
        } catch (err) { console.error(err); }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Sports</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Sport</button>
            </div>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', background: 'var(--surface)' }}>
                <input className="input-field" placeholder="Search sports..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select className="input-field" value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="Individual">Individual</option>
                    <option value="Team">Team</option>
                </select>
                <select className="input-field" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                </select>
            </div>

            <div className="grid grid-cols-1">
                {filteredSports.map(sport => (
                    <Card key={sport._id} actions={
                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => { setSelectedSportId(sport._id); setIsRequestModalOpen(true); }}>Join</button>
                            <button className="btn" style={{ background: 'var(--surface-hover)', color: 'var(--text-main)', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => { setFormData(sport); setEditingId(sport._id); setIsModalOpen(true); }}>Update</button>
                            <button className="btn" style={{ background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleDelete(sport._id)}>Delete</button>
                        </div>
                    }>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            {sport.image && (
                                <img src={sport.image} alt={sport.name} style={{ width: '200px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>{sport.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{sport.type} • {sport.category}</p>
                                <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>{sport.description}</p>
                                <p style={{ fontWeight: '500', color: 'var(--primary)', fontSize: '0.85rem' }}>SLIIT University Sports Program</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Sports Gallery</h2>
            <div className="grid grid-cols-3">
                <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=400" alt="Gallery Sport 1" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <img src="https://images.pexels.com/photos/29873465/pexels-photo-29873465.jpeg" alt="Gallery Sport 2" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <img src="https://images.unsplash.com/photo-1623720723560-d85879d0db79?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D" alt="Gallery Sport 3" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); setFormData({ name: '', description: '', type: 'Individual', category: 'Outdoor', image: '' }) }} title={editingId ? 'Update Sport' : 'Add Sport'}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className="input-field" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <textarea className="input-field" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    <select className="input-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} required>
                        <option value="Individual">Individual</option>
                        <option value="Team">Team</option>
                    </select>
                    <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                    </select>
                    <input className="input-field" placeholder="Image URL (Optional)" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>{editingId ? 'Update' : 'Submit'}</button>
                </form>
            </Modal>

            {/* Request to Join Modal */}
            <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title="Join Sport Request">
                <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please fill out the form to request joining the sport.</p>
                    <input className="input-field" placeholder="Full Name" value={requestData.studentName} onChange={e => setRequestData({ ...requestData, studentName: e.target.value })} required />
                    <input className="input-field" placeholder="Student ID (e.g. IT21000000)" value={requestData.studentId} onChange={e => setRequestData({ ...requestData, studentId: e.target.value })} required />
                    <textarea className="input-field" placeholder="Why do you want to join this sport?" value={requestData.reason} onChange={e => setRequestData({ ...requestData, reason: e.target.value })} required />
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Submit Request</button>
                </form>
            </Modal>
        </div>
    );
};

export default Sports;
