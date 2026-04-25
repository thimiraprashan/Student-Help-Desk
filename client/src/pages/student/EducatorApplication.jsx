import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const EducatorApplication = () => {
    const { navigate, backendUrl, getToken } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        studentId: '',
        email: '',
        phone: '',
        faculty: '',
        department: '',
        yearOfStudy: '1',
        semester: '1',
        currentGpa: '',
        subjectToSupport: '',
        moduleCode: '',
        gradeObtained: '',
        preferredTimeSlots: '',
        sessionFormat: 'Both',
        reasonToConduct: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (parseFloat(formData.currentGpa) < 0 || parseFloat(formData.currentGpa) > 4.0) {
            toast.error("GPA must be between 0.0 and 4.0");
            return false;
        }
        if (!formData.email.includes('@')) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (formData.studentId.length < 5) {
            toast.error("Please enter a valid Student ID");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const token = await getToken();
            const { data } = await axios.post(`${backendUrl}/api/educator/apply`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success(data.message);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8 lg:px-36">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-8 text-white">
                    <h1 className="text-3xl font-bold">Educator Application Form</h1>
                    <p className="opacity-80 mt-2">Please fill in your details accurately to apply.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input 
                                required name="fullName" value={formData.fullName} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Student ID</label>
                            <input 
                                required name="studentId" value={formData.studentId} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="IT21XXXXXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input 
                                required type="email" name="email" value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="name@university.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                            <input 
                                required name="phone" value={formData.phone} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="07XXXXXXXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Faculty</label>
                            <input 
                                required name="faculty" value={formData.faculty} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="Computing / Engineering / Business"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Department</label>
                            <input 
                                required name="department" value={formData.department} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="Software Engineering"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Year of Study</label>
                            <select 
                                name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            >
                                <option value="1">Year 1</option>
                                <option value="2">Year 2</option>
                                <option value="3">Year 3</option>
                                <option value="4">Year 4</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Semester</label>
                            <select 
                                name="semester" value={formData.semester} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            >
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Current GPA</label>
                            <input 
                                required type="number" step="0.01" name="currentGpa" value={formData.currentGpa} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="3.50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Module to Support</label>
                            <input 
                                required name="subjectToSupport" value={formData.subjectToSupport} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="React Development"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Module Code</label>
                            <input 
                                required name="moduleCode" value={formData.moduleCode} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="ITXXXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Grade in that Module</label>
                            <input 
                                required name="gradeObtained" value={formData.gradeObtained} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="A+ / A / A-"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Preferred Time Slots</label>
                        <input 
                            required name="preferredTimeSlots" value={formData.preferredTimeSlots} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="Weekdays after 5pm, Weekends 9am-12pm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Session Format</label>
                        <div className="flex gap-4 mt-2">
                            {['Physical', 'Online', 'Both'].map((format) => (
                                <label key={format} className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" name="sessionFormat" value={format} 
                                        checked={formData.sessionFormat === format} onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{format}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Why do you want to conduct sessions?</label>
                        <textarea 
                            required name="reasonToConduct" value={formData.reasonToConduct} onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                            placeholder="Share your motivation..."
                        ></textarea>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:bg-gray-400"
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EducatorApplication;
