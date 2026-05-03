import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Users, Search, Filter, Plus, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Clubs = () => {
    const [clubs, setClubs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', memberCount: 0, image: '' });
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestData, setRequestData] = useState({ studentName: '', studentId: '', faculty: 'Computing', year: '1st year' });
    const [selectedClubId, setSelectedClubId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [requests, setRequests] = useState([]);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [meetingDetails, setMeetingDetails] = useState('');
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const { mode, coordinatorType } = useAuth();

    const isClubCoordinator = mode === 'coordinator' && coordinatorType === 'Club';

    const fetchClubs = async () => {
        try {
            const res = await API.get('/clubs').catch(() => ({ data: [] }));
            setClubs(res.data || []);
        } catch (err) { }
    };

    const fetchRequests = async () => {
        if (!isClubCoordinator) return;
        try {
            const res = await API.get('/clubs/requests');
            setRequests(res.data || []);
        } catch (err) { }
    };

    useEffect(() => {
        fetchClubs();
        if (isClubCoordinator) fetchRequests();
    }, [isClubCoordinator]);

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
        if (confirm('Are you sure you want to remove this club?')) {
            await API.delete(`/clubs/${id}`);
            fetchClubs();
        }
    };

    const handleJoinSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/clubs/${selectedClubId}/request`, requestData);
            alert('Membership request sent successfully! You will be notified once reviewed.');
            setIsRequestModalOpen(false);
            setRequestData({ studentName: '', studentId: '', faculty: 'Computing', year: '1st year' });
        } catch (err) {
            console.error(err);
            alert('Failed to send request. Please ensure all fields are correct.');
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        if (status === 'Approved' && !meetingDetails) {
            setSelectedRequestId(requestId);
            setIsManageModalOpen(true);
            return;
        }

        try {
            await API.put(`/clubs/requests/${requestId}`, { status, meetingDetails });
            alert(`Request ${status.toLowerCase()} successfully! A notification message has been sent to the student.`);
            setIsManageModalOpen(false);
            setMeetingDetails('');
            fetchRequests();
        } catch (err) { console.error(err); }
    };

    const filteredClubs = clubs.filter(c => {
        return c.name.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>Clubs & Societies</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Discover communities and pursue your passions</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {isClubCoordinator && (
                        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Add Club
                        </button>
                    )}
                </div>
            </div>

            {isClubCoordinator && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'dashboard' ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: activeTab === 'requests' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'requests' ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            position: 'relative'
                        }}
                    >
                        User Requests
                        {requests.filter(r => r.status === 'Pending').length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: 'var(--danger)',
                                color: 'white',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '10px'
                            }}>
                                {requests.filter(r => r.status === 'Pending').length}
                            </span>
                        )}
                    </button>
                </div>
            )}

            {(!isClubCoordinator || activeTab === 'dashboard') && (
                <>
                    <div className="card" style={{ marginBottom: '2rem', background: 'var(--surface)', padding: '1.25rem' }}>
                        <div style={{ position: 'relative', maxWidth: '500px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input className="input-field" placeholder="Search clubs and societies..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: '2.75rem' }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1" style={{ gap: '1.5rem' }}>
                        {filteredClubs.map(club => (
                            <Card key={club._id} actions={
                                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    {!isClubCoordinator && (
                                        <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', fontWeight: 600 }} onClick={() => { setSelectedClubId(club._id); setIsRequestModalOpen(true); }}>Join Club</button>
                                    )}
                                    {isClubCoordinator && (
                                        <>
                                            <button className="btn" style={{ background: 'var(--surface-hover)', color: 'var(--text-main)', padding: '0.6rem 1rem' }} onClick={() => { setFormData(club); setEditingId(club._id); setIsModalOpen(true); }}>Update</button>
                                            <button className="btn" style={{ background: 'var(--danger)', color: 'white', padding: '0.6rem 1rem' }} onClick={() => handleDelete(club._id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            }>
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '320px', height: '200px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                                        <img src={club.image || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600'} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <Users size={22} color="var(--secondary)" />
                                            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.5rem' }}>{club.name}</h3>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 500 }}>{club.memberCount} Registered Members • Active Society</p>
                                        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-main)' }}>{club.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {isClubCoordinator && activeTab === 'requests' && (
                <div style={{ marginTop: '1rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock size={24} color="var(--primary)" /> Pending Student Membership Applications
                    </h2>
                    <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
                        {requests.filter(r => r.status === 'Pending').length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No pending applications at the moment.</p>
                        ) : (
                            requests.filter(r => r.status === 'Pending').map(req => (
                                <div key={req._id} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--secondary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{req.studentName} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>({req.studentId})</span></h4>
                                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}><strong>Club:</strong> {req.clubId?.name || 'Unknown'}</p>
                                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}><strong>Faculty:</strong> {req.faculty}</p>
                                            <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Academic Year:</strong> {req.year}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-primary" onClick={() => handleStatusUpdate(req._id, 'Approved')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                                                <CheckCircle size={16} /> Accept
                                            </button>
                                            <button className="btn" onClick={() => handleStatusUpdate(req._id, 'Rejected')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem' }}>
                                                <XCircle size={16} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {(!isClubCoordinator || activeTab === 'dashboard') && (
                <>
                    <h2 style={{ marginTop: '4rem', marginBottom: '2rem', color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 800 }}>Clubs Gallery</h2>
                    <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                        <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600" alt="Gallery 1" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }} />
                        <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600" alt="Gallery 2" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }} />
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600" alt="Gallery 3" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }} />
                    </div>
                </>
            )}

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); setFormData({ name: '', description: '', memberCount: 0, image: '' }) }} title={editingId ? 'Update Club' : 'Add New Club'}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Club Name</label>
                        <input className="input-field" placeholder="Coding Community" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
                        <textarea className="input-field" placeholder="Describe the club's mission and activities..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={{ minHeight: '100px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Initial Member Count</label>
                        <input className="input-field" type="number" placeholder="10" value={formData.memberCount} onChange={e => setFormData({ ...formData, memberCount: e.target.value })} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Banner Image URL</label>
                        <input className="input-field" placeholder="https://example.com/club.jpg" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>{editingId ? 'Update Club' : 'Create Club'}</button>
                </form>
            </Modal>

            <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title="Join Club Application">
                <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Full Name</label>
                            <input className="input-field" placeholder="Jane Doe" value={requestData.studentName} onChange={e => setRequestData({ ...requestData, studentName: e.target.value })} required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>IT Number</label>
                            <input className="input-field" placeholder="IT21000000" value={requestData.studentId} onChange={e => setRequestData({ ...requestData, studentId: e.target.value })} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Faculty</label>
                            <select className="input-field" value={requestData.faculty} onChange={e => setRequestData({ ...requestData, faculty: e.target.value })} required>
                                <option value="Computing">Computing</option>
                                <option value="Business">Business</option>
                                <option value="Engineering">Engineering</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Academic Year</label>
                            <select className="input-field" value={requestData.year} onChange={e => setRequestData({ ...requestData, year: e.target.value })} required>
                                <option value="1st year">1st Year</option>
                                <option value="2nd year">2nd Year</option>
                                <option value="3rd year">3rd Year</option>
                                <option value="4th year">4th Year</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Send size={18} /> Submit Membership Request
                    </button>
                </form>
            </Modal>


            <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="Introductory Meeting Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Provide details for the introductory session.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Meeting Info</label>
                        <textarea className="input-field" placeholder="e.g. Wednesday at 5 PM in Lab 04" value={meetingDetails} onChange={e => setMeetingDetails(e.target.value)} required style={{ minHeight: '100px' }} />
                    </div>
                    <button className="btn btn-primary" onClick={() => handleStatusUpdate(selectedRequestId, 'Approved')} disabled={!meetingDetails} style={{ padding: '0.75rem' }}>
                        Confirm & Welcome
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Clubs;
