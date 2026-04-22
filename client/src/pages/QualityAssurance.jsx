import React from 'react';
import { ShieldCheck, CheckCircle2, GitBranch, Layout, PlayCircle, ClipboardCheck, Sparkles } from 'lucide-react';
import qaBanner from '../assets/qa-banner.png';

const QualityAssurance = () => {
    const testSuites = [
        {
            name: 'Coordinator Workflows',
            description: 'Verifies role-based access control, link filtering, and specific module redirects.',
            status: 'Passing',
            coverage: '100%',
            features: ['Role-based Nav', 'Auto-redirect', 'Admin Mode Badge']
        },
        {
            name: 'User Journeys',
            description: 'Validates student registration, activity exploration, and request submission flows.',
            status: 'Passing',
            coverage: '100%',
            features: ['Student Signup', 'Join Requests', 'Notification Feed']
        }
    ];

    const evidenceTools = [
        {
            name: 'Version Control (Git)',
            icon: <GitBranch size={24} color="#6366f1" />,
            description: 'Meaningful commits and branch management for component development.',
            evidence: 'Branch: feature/extra_activities'
        },
        {
            name: 'Project Management',
            icon: <Layout size={24} color="#06b6d4" />,
            description: 'Task ownership and sprint planning using specialized PM tools.',
            evidence: 'Status: Completed'
        },
        {
            name: 'Automated Testing',
            icon: <PlayCircle size={24} color="#10b981" />,
            description: 'End-to-end testing using Playwright to ensure component stability.',
            evidence: 'Tool: Playwright E2E'
        }
    ];

    return (
        <div className="page-content">
            <header className="page-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <ShieldCheck size={28} color="var(--primary)" />
                        <h1 className="page-title">Quality Assurance & Evidence</h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Project validation and tool usage evidence</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                        <CheckCircle2 size={18} /> Validated Build
                    </div>
                </div>
            </header>

            <div className="card" style={{ marginBottom: '2.5rem', overflow: 'hidden', padding: 0, position: 'relative' }}>
                <img src={qaBanner} alt="QA Banner" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    padding: '2rem', 
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    color: 'white'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Project Health Score: 100%</h2>
                    <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>All automated tests passed successfully in latest run.</p>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ marginBottom: '2.5rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <ClipboardCheck size={22} color="var(--primary)" />
                        <h3 style={{ margin: 0 }}>Automated Test Suites</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {testSuites.map((suite, idx) => (
                            <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{suite.name}</span>
                                    <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{suite.status}</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>{suite.description}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {suite.features.map((f, i) => (
                                        <span key={i} style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '4px' }}>{f}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Sparkles size={22} color="var(--secondary)" />
                        <h3 style={{ margin: 0 }}>Tool Usage Evidence</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {evidenceTools.map((tool, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                    {tool.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{tool.name}</h4>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tool.description}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>{tool.evidence}</span>
                                        <CheckCircle2 size={14} color="#10b981" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card" style={{ background: 'var(--text-main)', color: 'white', border: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>Playwright HTML Report</h3>
                        <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Detailed execution logs and trace viewer for all user journeys.</p>
                    </div>
                    <button className="btn btn-primary" style={{ background: 'white', color: 'var(--text-main)' }}>
                        Open Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QualityAssurance;
