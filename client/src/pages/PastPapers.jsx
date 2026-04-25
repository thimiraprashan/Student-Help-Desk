import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Download, ExternalLink, FileText, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function PastPapers() {
  const [papers, setPapers] = useState([]);
  const [filters, setFilters] = useState({
    faculty: "",
    examType: "",
    search: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  const years = useMemo(
    () => [...new Set(papers.map((paper) => paper.year).filter(Boolean))].sort((a, b) => b - a),
    [papers]
  );

  const fetchPapers = async (nextFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      const params = Object.fromEntries(
        Object.entries(nextFilters).filter(([, value]) => value)
      );
      const res = await axios.get(`${API_BASE_URL}/api/papers`, { params });
      setPapers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load past papers.");
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    fetchPapers(nextFilters);
  };

  return (
    <section className="min-h-[70vh] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">Exam Resources</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Past Papers</h1>
            <p className="mt-2 text-slate-600">Find uploaded papers by faculty, exam type, module or title.</p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm md:w-80">
            <Search size={19} />
            <input
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 outline-none"
              placeholder="Search papers..."
              type="search"
            />
          </div>
        </div>

        <div className="mb-8 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
          <FilterControl label="Faculty" value={filters.faculty} onChange={(value) => updateFilter("faculty", value)}>
            <option value="">All faculties</option>
            <option value="Computing">Computing</option>
            <option value="Business">Business</option>
          </FilterControl>

          <FilterControl label="Exam Type" value={filters.examType} onChange={(value) => updateFilter("examType", value)}>
            <option value="">All exam types</option>
            <option value="Final">Final</option>
            <option value="Midterm">Midterm</option>
            <option value="Quiz">Quiz</option>
            <option value="Other">Other</option>
          </FilterControl>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                const nextFilters = { faculty: "", examType: "", search: "" };
                setFilters(nextFilters);
                fetchPapers(nextFilters);
              }}
              className="help-btn help-btn-secondary h-[46px] w-full"
            >
              <Filter size={17} />
              Clear Filters
            </button>
          </div>
        </div>

        {years.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {years.map((year) => (
              <span key={year} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                {year}
              </span>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center text-slate-500">
            Loading past papers...
          </div>
        ) : papers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center text-slate-500">
            No past papers available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {papers.map((paper, index) => (
              <PaperCard key={paper._id} paper={paper} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const FilterControl = ({ label, value, onChange, children }) => (
  <label className="space-y-2">
    <span className="block text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-[46px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
    >
      {children}
    </select>
  </label>
);

const PaperCard = ({ paper, index }) => {
  const fileHref = `${API_BASE_URL}/${paper.fileUrl}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex min-h-[255px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div>
        <div className="mb-5 flex items-start justify-between gap-4">
          <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
            paper.faculty === "Computing" ? "bg-cyan-50 text-cyan-700" : "bg-orange-50 text-orange-700"
          }`}>
            {paper.faculty}
          </span>
          <div className="rounded-2xl bg-slate-50 p-3 text-slate-500">
            <FileText size={22} />
          </div>
        </div>

        <h2 className="text-xl font-extrabold leading-tight text-slate-900">{paper.title}</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          {[paper.moduleCode, paper.moduleName].filter(Boolean).join(" - ") || "General paper"}
        </p>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {paper.description || "Open the file to view this past paper."}
        </p>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1">{paper.year}</span>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1">{paper.semester}</span>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1">{paper.examType}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={fileHref}
            target="_blank"
            rel="noopener noreferrer"
            className="help-btn help-btn-primary"
          >
            <ExternalLink size={16} />
            Open
          </a>
          <a
            href={fileHref}
            download
            className="help-btn help-btn-warm"
          >
            <Download size={16} />
            Download
          </a>
        </div>
      </div>
    </motion.article>
  );
};

export default PastPapers;
