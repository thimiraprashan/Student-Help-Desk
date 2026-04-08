import React, { useState, useEffect } from "react";
import Sidebar from "../Common/SSidebar";
import { getCompanySession } from "../../utils/sessionStore";

const internshipCategories = [
  "IT",
  "Software Engineering",
  "Marketing",
  "Design",
  "Finance",
  "HR",
];

const skillOptions = [
  "React",
  "Node.js",
  "Java",
  "Python",
  "UI/UX",
  "Communication",
];

const CompanyInternships = ({ db, setDb, userId }) => {

  const [showForm, setShowForm] = useState(false);
  const [isFormMinimized, setIsFormMinimized] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({
    title: "",
    field: "IT",
    location: "",
    duration: "3 months",
    deadline: "",
    skills: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [companyProfile, setCompanyProfile] = useState(null);

  const selectedSkills = form.skills
    ? form.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    const savedSession = getCompanySession();
    if (savedSession) {
      try {
        setCompanyProfile((prev) => ({
          ...prev,
          name: savedSession?.name || prev?.name || "Company",
        }));
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/company-profile?companyId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCompanyProfile(data);
        }
      })
      .catch(err => console.log(err));
  }, [userId]);

  useEffect(() => {
    fetch("http://localhost:5000/companies")
      .then(res => res.json())
      .then(data => {
        setDb(prev => ({
          ...prev,
          internships: data.data || []
        }));
      });
  }, [setDb]);

  const myInts = (db.internships || []).filter(
    (item) => String(item.companyId) === String(userId)
  );

  const resetForm = () => {
    setForm({
      title: "",
      field: "IT",
      location: "",
      duration: "3 months",
      deadline: "",
      skills: "",
      description: "",
    });
    setEditItem(null);
    setShowForm(false);
    setIsFormMinimized(false);
    setErrors({});
  };

  const toggleSkill = (skill) => {
    const nextSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((item) => item !== skill)
      : [...selectedSkills, skill];

    const value = nextSkills.join(", ");
    setForm((prev) => ({ ...prev, skills: value }));
    validateField("skills", value);
  };

  // 🔥 DELETE
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this internship?")) return;

    await fetch(`http://localhost:5000/companies/${id}`, {
      method: "DELETE"
    });

    const res = await fetch("http://localhost:5000/companies");
    const data = await res.json();

    setDb(prev => ({
      ...prev,
      internships: data.data || []
    }));
  };

  // 🔥 REAL-TIME VALIDATION
  const validateField = (name, value) => {
    let error = "";

    if (name === "title" && value.length < 3) {
      error = "Min 3 characters";
    }

    if (name === "location" && value.length < 3) {
      error = "Invalid location";
    }

    if (name === "duration" && !/^\d+\s(month|months)$/.test(value)) {
      error = "Example: 3 months";
    }

    if (name === "skills" && value.split(",").length < 2) {
      error = "Min 2 skills";
    }

    if (name === "description" && value.length < 10) {
      error = "Too short";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // 🔥 FULL VALIDATION
  const validateForm = () => {
    let newErrors = {};

    if (!form.title || form.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!form.location || form.location.length < 3) {
      newErrors.location = "Enter valid location";
    }

    if (!form.duration.match(/^\d+\s(month|months)$/)) {
      newErrors.duration = "Format: 3 months";
    }

    if (!form.deadline) {
      newErrors.deadline = "Deadline required";
    } else {
      const today = new Date();
      const selected = new Date(form.deadline);
      if (selected < today) {
        newErrors.deadline = "Future date only";
      }
    }

    if (!form.skills || form.skills.split(",").length < 2) {
      newErrors.skills = "Add at least 2 skills";
    }

    if (!form.description || form.description.length < 10) {
      newErrors.description = "Too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const profileRes = await fetch(`http://localhost:5000/company-profile?companyId=${userId}`);
    const profileData = await profileRes.json();

    const newItem = {
      ...form,
      companyId: userId,
      companyName: profileData?.name || companyProfile?.name || "Company",
      skills: form.skills.split(",").map(s => s.trim())
    };

    if (editItem) {
      await fetch(`http://localhost:5000/companies/${editItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });
    } else {
      await fetch("http://localhost:5000/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });
    }

    const res = await fetch("http://localhost:5000/companies");
    const data = await res.json();

    setDb(prev => ({
      ...prev,
      internships: data.data || []
    }));

    resetForm();
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar session={{ name: companyProfile?.name || "Company" }} role="company" />

      <div className="flex-1 p-6 lg:p-8">

        <div className="mb-8 rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-blue-500">
                Internship Management
              </p>
              <h2 className="mt-3 text-4xl font-bold text-slate-900">My Internships</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Publish, update, and manage openings for the currently logged-in company account.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-medium text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700"
            >
              + Post New
            </button>
          </div>
        </div>

        <div className="grid gap-5">
          {myInts.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">No internship posts yet</h3>
              <p className="mt-3 text-sm text-slate-500">
                Publish your first opening to start collecting student applications.
              </p>
            </div>
          )}

          {myInts.map(i => (
            <div key={i._id} className="rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">

              <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-slate-900">{i.title}</h3>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">
                      {i.field || "Internship"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-blue-600">{i.companyName}</p>

                  <p className="text-sm text-blue-800 flex gap-4 mt-1 items-center">
  <span>📍 {i.location}</span>
  <span>⏱ {i.duration}</span>
</p>

<p className="text-xs text-blue-700 mt-1 flex items-center gap-2">
  📅 {i.deadline}
</p>

                  <div className="flex gap-2 mt-2 flex-wrap">
  {i.skills?.map((s, index) => (
    <span key={`${s}-${index}`} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
      {s}
    </span>
  ))}
</div>
                </div>

                <div className="flex gap-3 items-center">
                  <button onClick={() => {
                    setEditItem(i);
                    setForm({
                      ...i,
                      skills: Array.isArray(i.skills) ? i.skills.join(", ") : i.skills || "",
                    });
                    setShowForm(true);
                  }} className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">Edit</button>

                  <button onClick={() => deleteItem(i._id)} className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">Delete</button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 px-4 py-6">

          <div className="mx-auto flex min-h-full max-w-xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 via-sky-50 to-white p-5 shadow-2xl">

            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-blue-500">
                  Internship Form
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {editItem ? "Edit Internship" : "Create New Internship"}
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormMinimized((prev) => !prev)}
                  className="rounded-xl bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200"
                >
                  {isFormMinimized ? "Expand" : "Minimize"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-600 hover:bg-white"
                >
                  Close
                </button>
              </div>
            </div>

            {!isFormMinimized && (
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Internship Title
                </label>
                <input
                  placeholder="Frontend Developer Intern"
                  value={form.title}
                  onChange={e => {
                    setForm({ ...form, title: e.target.value });
                    validateField("title", e.target.value);
                  }}
                  className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none ${errors.title ? "border-red-400" : "border-slate-300"}`}
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  placeholder="Colombo"
                  value={form.location}
                  onChange={e => {
                    setForm({ ...form, location: e.target.value });
                    validateField("location", e.target.value);
                  }}
                  className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none ${errors.location ? "border-red-400" : "border-slate-300"}`}
                />
                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Internship Category
                </label>
                <select
                  value={form.field}
                  onChange={(e) => setForm({ ...form, field: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
                >
                  {internshipCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Duration
                </label>
                <input
                  placeholder="3 months"
                  value={form.duration}
                  onChange={e => {
                    setForm({ ...form, duration: e.target.value });
                    validateField("duration", e.target.value);
                  }}
                  className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none ${errors.duration ? "border-red-400" : "border-slate-300"}`}
                />
                {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Deadline
                </label>
<input
  type="date"
  value={form.deadline}
  min={new Date().toISOString().split("T")[0]} // 🔥 disable past dates
  onChange={e => {
    const value = e.target.value;
    setForm({ ...form, deadline: value });
    validateField("deadline", value); // optional realtime validation
  }}
  className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none ${
    errors.deadline ? "border-red-400" : "border-blue-200"
  }`}
/>
                {errors.deadline && <p className="mt-1 text-xs text-red-500">{errors.deadline}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          active
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
                {selectedSkills.length > 0 && (
                  <p className="mt-3 text-sm text-slate-500">
                    Selected: {selectedSkills.join(", ")}
                  </p>
                )}
                {errors.skills && <p className="mt-1 text-xs text-red-500">{errors.skills}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  placeholder="Describe the role, responsibilities, and what kind of candidate you are looking for."
                  value={form.description}
                  onChange={e => {
                    setForm({ ...form, description: e.target.value });
                    validateField("description", e.target.value);
                  }}
                  className={`min-h-32 w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none ${errors.description ? "border-red-400" : "border-slate-300"}`}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>

            <button className="md:col-span-2 mt-2 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-medium text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700">
              {editItem ? "Update Internship" : "Save Internship"}
            </button>

            </form>
            )}

          </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default CompanyInternships;
