import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
    Search, 
    LogOut, 
    CheckCircle, 
    XCircle, 
    Clock, 
    MoreHorizontal, 
    User, 
    BookOpen, 
    GraduationCap, 
    Mail, 
    Phone,
    FileText,
    ArrowRight
} from 'lucide-react';

const DeptHeadApproval = () => {
    const { backendUrl, navigate } = useContext(AppContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchApplications = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/educator/applications`);
            if (data.success) {
                setApplications(data.applications);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusUpdate = async (id, status, reason = '') => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/educator/application-status/${id}`, {
                status,
                rejectionReason: reason
            });

            if (data.success) {
                toast.success(`Application ${status} successfully`);
                fetchApplications();
                setShowRejectModal(false);
                setShowDetailModal(false);
                setSelectedApp(null);
                setRejectionReason('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = 
            app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.subjectToSupport.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.moduleCode.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50'>
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600 font-medium tracking-wide">Loading Academic Applications...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Admin Portal</h1>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Department Head Dashboard</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => { localStorage.removeItem('adminToken'); navigate('/'); }}
                        className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-semibold text-sm transition-all px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-6 py-10">
                {/* Stats & Search Header */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
                    <div className="xl:col-span-3 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search applications by student name, ID, or module..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                            />
                        </div>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-700 outline-none focus:border-blue-500 transition-all cursor-pointer min-w-[180px]"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    
                    <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                        <div className="pl-2">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Pending</p>
                            <p className="text-3xl font-black text-white mt-1">
                                {applications.filter(a => a.status === 'Pending').length}
                            </p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl">
                            <Clock className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-left">Student Information</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-left">Academic Background</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-left">Support Module</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredApplications.length > 0 ? filteredApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                                                    {app.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{app.fullName}</p>
                                                    <p className="text-sm font-semibold text-blue-600">{app.studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            <p className="font-bold text-slate-800">{app.faculty}</p>
                                            <p className="text-slate-500 font-medium mt-0.5">{app.department}</p>
                                            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                                                GPA {app.currentGpa}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            <p className="font-bold text-slate-900 leading-tight">{app.subjectToSupport}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-slate-500 font-semibold uppercase text-[11px] tracking-wider">{app.moduleCode}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                <span className="text-emerald-600 font-black">Grade {app.gradeObtained}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest
                                                ${app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                  app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                                  'bg-amber-50 text-amber-700 border border-amber-100'}
                                            `}>
                                                <div className={`w-1.5 h-1.5 rounded-full 
                                                    ${app.status === 'Approved' ? 'bg-emerald-500' :
                                                      app.status === 'Rejected' ? 'bg-rose-500' :
                                                      'bg-amber-500'}
                                                `}></div>
                                                {app.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => { setSelectedApp(app); setShowDetailModal(true); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <FileText className="w-5 h-5" />
                                                </button>
                                                {app.status === 'Pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(app._id, 'Approved')}
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => { setSelectedApp(app); setShowRejectModal(true); }}
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center">
                                            <div className="flex flex-col items-center text-slate-400">
                                                <div className="bg-slate-50 p-6 rounded-3xl mb-4">
                                                    <FileText className="w-12 h-12 opacity-20" />
                                                </div>
                                                <p className="text-lg font-bold text-slate-500">No applications found</p>
                                                <p className="text-sm font-medium mt-1">Try adjusting your filters or search terms</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Rejection Modal - Modern Design */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
                    <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                                <XCircle className="w-7 h-7 text-rose-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 leading-tight">Decline Application</h2>
                                <p className="text-sm font-semibold text-slate-500 mt-1">For: {selectedApp?.fullName}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Rejection Reason</label>
                                <textarea 
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all h-40 font-medium text-slate-700 resize-none"
                                    placeholder="Explain the reason for declining this academic application..."
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button 
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(selectedApp._id, 'Rejected', rejectionReason)}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg"
                                >
                                    Confirm Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Professional Detail Modal */}
            {showDetailModal && selectedApp && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[2000] p-4">
                    <div className="bg-white rounded-[2.5rem] p-0 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                        {/* Modal Header */}
                        <div className="bg-slate-900 p-10 text-white relative">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white font-bold text-4xl shadow-2xl shadow-blue-500/20">
                                    {selectedApp.fullName.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-bold tracking-tight">{selectedApp.fullName}</h2>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20 bg-white/10`}>
                                            {selectedApp.status}
                                        </span>
                                    </div>
                                    <p className="text-blue-400 font-semibold text-lg">{selectedApp.studentId}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                                            <Mail className="w-4 h-4" /> {selectedApp.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                                            <Phone className="w-4 h-4" /> {selectedApp.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowDetailModal(false)} 
                                className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10"
                            >
                                <XCircle className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                            <div className="grid grid-cols-3 gap-6 mb-10">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Academic Base</p>
                                    <p className="text-slate-900 font-bold text-base leading-tight">{selectedApp.faculty}</p>
                                    <p className="text-slate-500 font-semibold text-sm mt-1">{selectedApp.department}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Performance</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-black text-slate-900">{selectedApp.currentGpa}</p>
                                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">GPA</p>
                                    </div>
                                    <p className="text-emerald-600 font-bold text-sm mt-2 flex items-center gap-1.5">
                                        <CheckCircle className="w-4 h-4" /> Grade {selectedApp.gradeObtained}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Format</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        <p className="text-slate-900 font-bold text-base">{selectedApp.sessionFormat}</p>
                                    </div>
                                    <p className="text-slate-500 font-semibold text-sm mt-1">Teaching Preference</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <section>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Module Request</h3>
                                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{selectedApp.subjectToSupport}</p>
                                            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-2">{selectedApp.moduleCode}</p>
                                        </div>
                                        <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                                            <BookOpen className="w-6 h-6 text-slate-400" />
                                            <span className="font-bold text-slate-700">Course Resource</span>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Personal Statement</h3>
                                    <div className="bg-slate-900 p-8 rounded-3xl text-slate-300 font-medium leading-relaxed italic border-l-8 border-blue-600">
                                        <span className="text-4xl text-blue-600 block mb-2 opacity-50 font-serif">"</span>
                                        {selectedApp.statement || "No personal statement provided by the student."}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Modal Action Footer */}
                        <div className="p-8 border-t border-slate-200 bg-white flex justify-between items-center">
                            <div className="text-slate-500 font-semibold text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Received on {new Date(selectedApp.createdAt).toLocaleDateString()}
                            </div>
                            
                            {selectedApp.status === 'Pending' ? (
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedApp._id, 'Approved')}
                                        className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Approve Candidate
                                    </button>
                                    <button 
                                        onClick={() => { setShowDetailModal(false); setShowRejectModal(true); }}
                                        className="bg-white border border-slate-200 text-slate-600 px-8 py-3.5 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Decline
                                    </button>
                                </div>
                            ) : (
                                <div className={`px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest border
                                    ${selectedApp.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}
                                `}>
                                    Application {selectedApp.status}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeptHeadApproval;
