import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle2, Mail, Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/contact-messages`;

const statusColors = {
  New: "bg-cyan-500/10 text-cyan-400",
  Read: "bg-amber-500/10 text-amber-400",
  Resolved: "bg-emerald-500/10 text-emerald-400",
};

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filters, setFilters] = useState({ status: "", faculty: "", search: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (nextFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value));
      const res = await axios.get(API_URL, { params });
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    fetchMessages(nextFilters);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status });
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update message status");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete message");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Incoming Messages</h3>
          <p className="text-slate-400 text-sm">View and manage Contact SLIIT submissions</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:w-[760px]">
          <label className="admin-filter">
            <span>Status</span>
            <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}>
              <option value="">All</option>
              <option value="New">New</option>
              <option value="Read">Read</option>
              <option value="Resolved">Resolved</option>
            </select>
          </label>

          <label className="admin-filter">
            <span>Faculty</span>
            <select value={filters.faculty} onChange={(e) => updateFilter("faculty", e.target.value)}>
              <option value="">All</option>
              <option value="Computing">Computing</option>
              <option value="Business">Business</option>
              <option value="Engineering">Engineering</option>
              <option value="Humanities & Sciences">Humanities & Sciences</option>
              <option value="Graduate Studies">Graduate Studies</option>
            </select>
          </label>

          <label className="admin-filter">
            <span>Search</span>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3">
              <Search size={16} className="text-slate-500" />
              <input
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="ID, name, subject"
                className="h-11 w-full bg-transparent text-sm text-white outline-none"
              />
            </div>
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="admin-card py-20 text-center text-slate-400">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="admin-card py-20 text-center text-slate-400">No contact messages found.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.article layout key={message._id} className="admin-card p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColors[message.status]}`}>
                      {message.status}
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {message.reasonType}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white">{message.subject}</h4>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{message.message}</p>

                  <div className="mt-5 grid gap-2 text-sm text-slate-400 md:grid-cols-2 xl:grid-cols-4">
                    <Info label="Student ID" value={message.studentId} />
                    <Info label="Name" value={message.studentName} />
                    <Info label="Year" value={message.studentYear} />
                    <Info label="Faculty" value={message.faculty} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:w-56 xl:flex-col">
                  <button onClick={() => updateStatus(message._id, "Read")} className="admin-button-secondary flex items-center justify-center gap-2">
                    <Mail size={16} />
                    Mark Read
                  </button>
                  <button onClick={() => updateStatus(message._id, "Resolved")} className="admin-button-secondary flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    Resolve
                  </button>
                  <button onClick={() => deleteMessage(message._id)} className="admin-button-danger flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-xl bg-white/5 px-3 py-2">
    <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
    <span className="font-semibold text-slate-300">{value}</span>
  </div>
);

export default AdminMessages;
