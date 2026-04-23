import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, X, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/study-guide`;

const AdminDashboardMa = () => {
  const [materials, setMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    faculty: 'Computing',
    category: 'Programming',
    description: '',
    content: ''
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      setMaterials(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch materials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingMaterial) {
        await axios.put(`${API_URL}/${editingMaterial._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchMaterials();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save material');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMaterials();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete material');
    }
  };

  const openModal = (material = null) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({
        title: material.title,
        faculty: material.faculty,
        category: material.category,
        description: material.description || '',
        content: material.content || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingMaterial(null);
    setFormData({
      title: '',
      faculty: 'Computing',
      category: 'Programming',
      description: '',
      content: ''
    });
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Materials List</h3>
          <p className="text-slate-400 text-sm">Manage all study guides across faculties</p>
        </div>
        <button
          onClick={() => openModal()}
          className="admin-button-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((item) => (
          <motion.div
            layout
            key={item._id}
            className="admin-card p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  item.faculty === 'Computing' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-orange-500/10 text-orange-400'
                }`}>
                  {item.faculty}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openModal(item)} className="p-2 text-slate-400 hover:text-white transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-sm text-slate-400 line-clamp-2 mb-4">{item.description}</p>
              <div className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded w-fit">
                {item.category}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {materials.length === 0 && !isLoading && (
        <div className="text-center py-20 admin-card">
          <p className="text-slate-400">No materials found. Start by adding one!</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="admin-card w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-lg font-bold text-white">
                  {editingMaterial ? 'Edit Material' : 'Add New'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-admin-primary"
                    placeholder="Enter material title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Faculty</label>
                    <select
                      value={formData.faculty}
                      onChange={(e) => {
                        const newFaculty = e.target.value;
                        setFormData({
                          ...formData,
                          faculty: newFaculty,
                          // Auto-set category to Module Guide if Business is selected
                          category: newFaculty === 'Business' ? 'Module Guide' : formData.category
                        });
                      }}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-admin-primary"
                    >
                      <option value="Computing">Computing</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-admin-primary"
                    >
                      {formData.faculty === 'Computing' ? (
                        <>
                          <option value="Programming">Programming</option>
                          <option value="Module Guide">Module Guide</option>
                        </>
                      ) : (
                        <option value="Module Guide">Module Guide</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-admin-primary"
                    placeholder="Brief summary..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Content</label>
                  <textarea
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-admin-primary font-mono text-sm"
                    placeholder="Paste link or content here..."
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="admin-button-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="admin-button-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {editingMaterial ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboardMa;
