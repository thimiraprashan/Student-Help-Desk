import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Users } from 'lucide-react';

const Clubs = () => {
    const [clubs, setClubs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', memberCount: 0, image: '' });
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestData, setRequestData] = useState({ studentName: '', studentId: '', faculty: 'Computing' });
    const [selectedClubId, setSelectedClubId] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fetchClubs = async () => {
        try {
            const res = await API.get('/clubs').catch(() => ({ data: [] }));
            setClubs(res.data || []);
        } catch (err) { }
    };

    useEffect(() => { fetchClubs(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/clubs/${editingId}`, formData);
            } else {
                await API.post('/clubs', formData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ name: '', description: '', memberCount: 0, image: '' });
            fetchClubs();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            await API.delete(`/clubs/${id}`);
            fetchClubs();
        }
    };

    const handleJoinSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/clubs/${selectedClubId}/request`, requestData);
            alert('Join request sent successfully!');
            setIsRequestModalOpen(false);
            setRequestData({ studentName: '', studentId: '', faculty: 'Computing' });
        } catch (err) {
            console.error(err);
            alert('Failed to send request.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Clubs & Societies</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Club</button>
            </div>

            <div className="grid grid-cols-1">
                {clubs.map(club => (
                    <Card key={club._id} actions={
                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => { setSelectedClubId(club._id); setIsRequestModalOpen(true); }}>Join</button>
                            <button className="btn" style={{ background: 'var(--surface-hover)', color: 'var(--text-main)', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => { setFormData(club); setEditingId(club._id); setIsModalOpen(true); }}>Update</button>
                            <button className="btn" style={{ background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => handleDelete(club._id)}>Delete</button>
                        </div>
                    }>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            {club.image && (
                                <img src={club.image} alt={club.name} style={{ width: '200px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--secondary)' }}>{club.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{club.memberCount} Members • Active Society</p>
                                <p style={{ fontSize: '0.95rem' }}>{club.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Clubs Gallery</h2>
            <div className="grid grid-cols-3">
                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400" alt="Gallery Club 1" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400" alt="Gallery Club 2" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400" alt="Gallery Club 3" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); setFormData({ name: '', description: '', memberCount: 0, image: '' }) }} title={editingId ? 'Update Club' : 'Add Club'}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className="input-field" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <textarea className="input-field" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    <input className="input-field" type="number" placeholder="Member Count" value={formData.memberCount} onChange={e => setFormData({ ...formData, memberCount: e.target.value })} required />
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>{editingId ? 'Update' : 'Submit'}</button>
                </form>
            </Modal>

            {/* Join Request Modal */}
            <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title="Club Membership Request">
                <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className="input-field" placeholder="Full Name" value={requestData.studentName} onChange={e => setRequestData({ ...requestData, studentName: e.target.value })} required />
                    <input className="input-field" placeholder="SLIIT ID (e.g. IT21000000)" value={requestData.studentId} onChange={e => setRequestData({ ...requestData, studentId: e.target.value })} required />
                    <select className="input-field" value={requestData.faculty} onChange={e => setRequestData({ ...requestData, faculty: e.target.value })} required>
                        <option value="Computing">Computing Faculty</option>
                        <option value="Business">Business Faculty</option>
                        <option value="Engineering">Engineering Faculty</option>
                    </select>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Send Request</button>
                </form>
            </Modal>
        </div>
    );
};

export default Clubs;
