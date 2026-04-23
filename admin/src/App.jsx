import React, { useState } from 'react';
import AdminDashboardMa from './components/AdminDashboardMa';
import { LayoutDashboard, BookOpen, LogOut } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('study-guide');

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-admin-secondary border-r border-white/5 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-admin-primary rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin Panel</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab('study-guide')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'study-guide'
                ? 'bg-admin-primary text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Study Guide</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-admin-background">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-admin-background/50 backdrop-blur-xl sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white">
            {activeTab === 'study-guide' ? 'Manage Study Guide' : 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-700 border border-white/10" />
          </div>
        </header>

        <div className="p-10">
          {activeTab === 'study-guide' && <AdminDashboardMa />}
        </div>
      </main>
    </div>
  );
}

export default App;
