import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const BecomeEducator = () => {
    const { navigate } = useContext(AppContext);

    const requirements = [
        {
            title: "Academic Requirements",
            items: [
                "Minimum GPA of 3.0 or above (or equivalent) in the relevant subject area",
                "Must have successfully completed the course they wish to support",
                "Currently enrolled as an undergraduate or postgraduate student",
                "No pending academic disciplinary actions"
            ]
        },
        {
            title: "Knowledge & Skills Requirements",
            items: [
                "Strong understanding of the subject matter",
                "Ability to explain concepts clearly and simply",
                "Good written and verbal communication skills",
                "Basic presentation and teaching skills"
            ]
        },
        {
            title: "Administrative Requirements",
            items: [
                "Submit a formal application through the student portal",
                "Provide academic transcripts or grade proof",
                "Obtain approval from the relevant lecturer or department head",
                "Attend a mandatory orientation or training session before conducting sessions"
            ]
        },
        {
            title: "Professional Requirements",
            items: [
                "Maintain punctuality and commitment to scheduled sessions",
                "Follow university code of conduct at all times",
                "Maintain confidentiality of student information"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white py-20 px-4 sm:px-8 lg:px-36">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Become a Student Educator</h1>
                    <p className="text-xl text-slate-700 font-bold max-w-2xl mx-auto leading-relaxed">
                        Join our elite community of student leaders. Share your knowledge, enhance your skills, and help your peers excel.
                    </p>
                </div>

                <div className="grid gap-10 md:grid-cols-2">
                    {requirements.map((req, index) => (
                        <div key={index} className="bg-slate-50 p-10 rounded-[2.5rem] border-4 border-slate-100 hover:border-blue-200 transition-all shadow-sm">
                            <h2 className="text-2xl font-black text-blue-700 mb-8 flex items-center gap-4">
                                <span className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-lg shadow-lg shadow-blue-200 shrink-0">{index + 1}</span>
                                {req.title}
                            </h2>
                            <ul className="space-y-5">
                                {req.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-slate-800 text-base font-bold leading-relaxed">
                                        <div className="mt-1 bg-green-100 rounded-full p-1 shrink-0">
                                            <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-slate-900 rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full -ml-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mb-32 blur-3xl"></div>
                    
                    <h2 className="text-4xl font-black mb-6 relative z-10">Ready to make a difference?</h2>
                    <p className="text-xl mb-10 text-slate-300 font-bold relative z-10">If you meet the requirements above, we invite you to submit your formal application.</p>
                    
                    <button 
                        onClick={() => navigate('/educator-apply')}
                        className="bg-blue-600 text-white font-black text-2xl px-12 py-5 rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 relative z-10"
                    >
                        Apply to Become Educator
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BecomeEducator;
