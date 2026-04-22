import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Trophy, Search, Filter, Plus, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sports = () => {
    const [sports, setSports] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', type: 'Individual', category: 'Outdoor', image: '' });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestData, setRequestData] = useState({ studentName: '', studentId: '', faculty: 'IT', qualifications: '', requestType: '' });
    const [selectedSportId, setSelectedSportId] = useState(null);
    const [requests, setRequests] = useState([]);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [meetingDetails, setMeetingDetails] = useState('');
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const { mode, coordinatorType } = useAuth();

    const isSportCoordinator = mode === 'coordinator' && coordinatorType === 'Sport';

    const fetchSports = async () => {
        try {
            const res = await API.get('/sports').catch(() => ({ data: [] }));
            setSports(res.data || []);
        } catch (err) { }
    };

    const fetchRequests = async () => {
        if (!isSportCoordinator) return;
        try {
            const res = await API.get('/sports/requests');
            setRequests(res.data || []);
        } catch (err) { }
    };

    useEffect(() => {
        fetchSports();
        if (isSportCoordinator) fetchRequests();
    }, [isSportCoordinator]);

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
        if (confirm('Are you sure you want to remove this sport?')) {
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
            alert('Join request submitted successfully!');
            setIsRequestModalOpen(false);
            setRequestData({ studentName: '', studentId: '', faculty: 'IT', qualifications: '', requestType: '' });
        } catch (err) { console.error(err); }
    };

    const handleStatusUpdate = async (requestId, status) => {
        if (status === 'Approved' && !meetingDetails) {
            setSelectedRequestId(requestId);
            setIsManageModalOpen(true);
            return;
        }

        try {
            await API.put(`/sports/requests/${requestId}`, { status, meetingDetails });
            alert(`Request ${status.toLowerCase()} successfully! A notification message has been sent to the student.`);
            setIsManageModalOpen(false);
            setMeetingDetails('');
            fetchRequests();
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>Sports Program</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Join a team, stay fit, and compete</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {isSportCoordinator && (
                        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Add Sport
                        </button>
                    )}
                </div>
            </div>

            {isSportCoordinator && (
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

            {(!isSportCoordinator || activeTab === 'dashboard') && (
                <>
                    <div className="card" style={{ marginBottom: '2rem', background: 'var(--surface)', padding: '1.25rem' }}>
                        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="input-field" placeholder="Search sports..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ paddingLeft: '2.75rem' }} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <select className="input-field" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ paddingLeft: '2.75rem' }}>
                                    <option value="">All Types</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Team">Team</option>
                                </select>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <select className="input-field" value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ paddingLeft: '2.75rem' }}>
                                    <option value="">All Categories</option>
                                    <option value="Indoor">Indoor</option>
                                    <option value="Outdoor">Outdoor</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1" style={{ gap: '1.5rem' }}>
                        {filteredSports.map(sport => (
                            <Card key={sport._id} actions={
                                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    {!isSportCoordinator && (
                                        <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', fontWeight: 600 }} onClick={() => { setSelectedSportId(sport._id); setIsRequestModalOpen(true); }}>Join Now</button>
                                    )}
                                    {isSportCoordinator && (
                                        <>
                                            <button className="btn" style={{ background: 'var(--surface-hover)', color: 'var(--text-main)', padding: '0.6rem 1rem' }} onClick={() => { setFormData(sport); setEditingId(sport._id); setIsModalOpen(true); }}>Update</button>
                                            <button className="btn" style={{ background: 'var(--danger)', color: 'white', padding: '0.6rem 1rem' }} onClick={() => handleDelete(sport._id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            }>
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                                    <div style={{ position: 'relative', width: '320px', height: '200px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                                        <img src={sport.image || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600'} alt={sport.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{sport.category}</div>
                                    </div>
                                    <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <Trophy size={22} color="var(--primary)" />
                                            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.5rem' }}>{sport.name}</h3>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 500 }}>{sport.type} Sport • University League</p>
                                        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '1rem' }}>{sport.description}</p>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, background: 'rgba(99, 102, 241, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>Available for all faculties</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {isSportCoordinator && activeTab === 'requests' && (
                <div style={{ marginTop: '1rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock size={24} color="var(--primary)" /> Pending Student Applications
                    </h2>
                    <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
                        {requests.filter(r => r.status === 'Pending').length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No pending applications at the moment.</p>
                        ) : (
                            requests.filter(r => r.status === 'Pending').map(req => (
                                <div key={req._id} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{req.studentName} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>({req.studentId})</span></h4>
                                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}><strong>Sport:</strong> {req.sportId?.name || 'Unknown'}</p>
                                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}><strong>Faculty:</strong> {req.faculty}</p>
                                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}><strong>Qualifications:</strong> {req.qualifications}</p>
                                            {req.requestType && <p style={{ margin: 0, fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>Note: {req.requestType}</p>}
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

            {(!isSportCoordinator || activeTab === 'dashboard') && (
                <>
                    <h2 style={{ marginTop: '4rem', marginBottom: '2rem', color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 800 }}>Sports Gallery</h2>
                    <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
                        <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600" alt="Gallery 1" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }} />
                        <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600" alt="Gallery 2" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }} />
                        <img src="https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&q=80&w=600" alt="Gallery 3" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }} />
                    </div>
                </>
            )}

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); setFormData({ name: '', description: '', type: 'Individual', category: 'Outdoor', image: '' }) }} title={editingId ? 'Update Sport' : 'Add New Sport'}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sport Name</label>
                        <input className="input-field" placeholder="Basketball" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
                        <textarea className="input-field" placeholder="Describe the sport and requirements..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={{ minHeight: '100px' }} />
                    </div>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Type</label>
                            <select className="input-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} required>
                                <option value="Individual">Individual</option>
                                <option value="Team">Team</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
                            <select className="input-field" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                                <option value="Indoor">Indoor</option>
                                <option value="Outdoor">Outdoor</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Banner Image URL</label>
                        <input className="input-field" placeholder="https://example.com/sport.jpg" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }}>{editingId ? 'Update Sport' : 'Create Sport'}</button>
                </form>
            </Modal>

            <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title="Join Sport Request Form">
                <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Full Name</label>
                            <input className="input-field" placeholder="John Doe" value={requestData.studentName} onChange={e => setRequestData({ ...requestData, studentName: e.target.value })} required />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>IT Number</label>
                            <input className="input-field" placeholder="IT21000000" value={requestData.studentId} onChange={e => setRequestData({ ...requestData, studentId: e.target.value })} required />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Faculty</label>
                        <select className="input-field" value={requestData.faculty} onChange={e => setRequestData({ ...requestData, faculty: e.target.value })} required>
                            <option value="IT">IT Faculty</option>
                            <option value="Business">Business Faculty</option>
                            <option value="Engineering">Engineering Faculty</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Your Qualifications</label>
                        <textarea className="input-field" placeholder="List any previous experience or skills..." value={requestData.qualifications} onChange={e => setRequestData({ ...requestData, qualifications: e.target.value })} required style={{ minHeight: '80px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Request Type (Optional)</label>
                        <input className="input-field" placeholder="e.g. Regular player, Casual member" value={requestData.requestType} onChange={e => setRequestData({ ...requestData, requestType: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Send size={18} /> Submit Application
                    </button>
                </form>
            </Modal>

            <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="Add Meeting Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>The student will receive a notification with these details.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Meeting Place & Time</label>
                        <textarea className="input-field" placeholder="e.g. Sports Complex, Room 202 on Friday at 4 PM" value={meetingDetails} onChange={e => setMeetingDetails(e.target.value)} required style={{ minHeight: '100px' }} />
                    </div>
                    <button className="btn btn-primary" onClick={() => handleStatusUpdate(selectedRequestId, 'Approved')} disabled={!meetingDetails} style={{ padding: '0.75rem' }}>
                        Confirm & Accept
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Sports;
