import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, Download, FileText, Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/papers`;

const initialForm = {
  title: "",
  faculty: "Computing",
  moduleCode: "",
  moduleName: "",
  year: new Date().getFullYear(),
  semester: "Semester 1",
  examType: "Final",
  description: "",
  paper: null,
};

const AdminPastPapers = () => {
  const [papers, setPapers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingPaper, setEditingPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      setPapers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch past papers");
    } finally {
      setIsLoading(false);
    }
  };

  const buildPayload = () => {
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "paper") {
        if (value) payload.append("paper", value);
      } else {
        payload.append(key, value ?? "");
      }
    });

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = buildPayload();
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingPaper) {
        await axios.put(`${API_URL}/${editingPaper._id}`, payload, config);
      } else {
        await axios.post(API_URL, payload, config);
      }

      setIsModalOpen(false);
      resetForm();
      fetchPapers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save past paper");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this past paper?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPapers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete past paper");
    }
  };

  const openModal = (paper = null) => {
    setError(null);

    if (paper) {
      setEditingPaper(paper);
      setFormData({
        title: paper.title || "",
        faculty: paper.faculty || "Computing",
        moduleCode: paper.moduleCode || "",
        moduleName: paper.moduleName || "",
        year: paper.year || new Date().getFullYear(),
        semester: paper.semester || "Semester 1",
        examType: paper.examType || "Final",
        description: paper.description || "",
        paper: null,
      });
    } else {
      resetForm();
    }

    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingPaper(null);
    setFormData(initialForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Past Papers</h3>
          <p className="text-slate-400 text-sm">Upload, edit and remove papers shown to students</p>
        </div>
        <button onClick={() => openModal()} className="admin-button-primary flex items-center gap-2">
          <Plus size={20} />
          Add Paper
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {papers.map((paper) => (
          <motion.article layout key={paper._id} className="admin-card p-6 flex flex-col justify-between gap-5">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  paper.faculty === "Computing" ? "bg-cyan-500/10 text-cyan-400" : "bg-orange-500/10 text-orange-400"
                }`}>
                  {paper.faculty}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openModal(paper)} className="p-2 text-slate-400 hover:text-white transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(paper._id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h4 className="text-lg font-bold text-white mb-2">{paper.title}</h4>
              <p className="text-sm text-slate-400 line-clamp-2 mb-4">{paper.description || "No description added."}</p>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-400">
                <span className="bg-white/5 px-2 py-1 rounded">{paper.moduleCode || "No code"}</span>
                <span className="bg-white/5 px-2 py-1 rounded">{paper.year}</span>
                <span className="bg-white/5 px-2 py-1 rounded">{paper.examType}</span>
              </div>
            </div>

            <a
              href={`${API_BASE_URL}/${paper.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-button-secondary flex items-center justify-center gap-2 text-sm"
            >
              <Download size={16} />
              Open File
            </a>
          </motion.article>
        ))}
      </div>

      {papers.length === 0 && !isLoading && (
        <div className="text-center py-20 admin-card">
          <p className="text-slate-400">No past papers found. Upload the first one.</p>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="admin-card w-full max-w-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-lg font-bold text-white">
                  {editingPaper ? "Edit Past Paper" : "Upload Past Paper"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Title">
                    <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="admin-input" placeholder="e.g. SE1010 Final Paper" />
                  </Field>
                  <Field label="Year">
                    <input required type="number" min="2000" max="2100" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="admin-input" />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Faculty">
                    <select value={formData.faculty} onChange={(e) => setFormData({ ...formData, faculty: e.target.value })} className="admin-input">
                      <option value="Computing">Computing</option>
                      <option value="Business">Business</option>
                    </select>
                  </Field>
                  <Field label="Exam Type">
                    <select value={formData.examType} onChange={(e) => setFormData({ ...formData, examType: e.target.value })} className="admin-input">
                      <option value="Final">Final</option>
                      <option value="Midterm">Midterm</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Module Code">
                    <input value={formData.moduleCode} onChange={(e) => setFormData({ ...formData, moduleCode: e.target.value })} className="admin-input" placeholder="e.g. SE1010" />
                  </Field>
                  <Field label="Module Name">
                    <input value={formData.moduleName} onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })} className="admin-input" placeholder="Module name" />
                  </Field>
                </div>

                <Field label="Semester">
                  <select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="admin-input">
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>

                <Field label="Description">
                  <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="admin-input" placeholder="Short note for students..." />
                </Field>

                <Field label={editingPaper ? "Replace File" : "Upload File"}>
                  <label className="flex items-center gap-3 w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-300 cursor-pointer hover:border-admin-primary transition-colors">
                    <Upload size={18} />
                    <span className="truncate">{formData.paper?.name || (editingPaper ? editingPaper.fileName : "Choose PDF, image, or document")}</span>
                    <input
                      type="file"
                      required={!editingPaper}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={(e) => setFormData({ ...formData, paper: e.target.files?.[0] || null })}
                      className="hidden"
                    />
                  </label>
                </Field>

                {editingPaper && (
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-400">
                    <FileText size={16} />
                    Current file stays unchanged unless you choose a new one.
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading} className="admin-button-primary flex-1 flex items-center justify-center gap-2">
                    <Save size={18} />
                    {editingPaper ? "Update" : "Upload"}
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

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

export default AdminPastPapers;
