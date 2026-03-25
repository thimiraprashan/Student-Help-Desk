import React, { useState, useEffect } from "react";
import Sidebar from "../Common/SSidebar";

const CompanyInternships = ({ db, setDb, userId }) => {

  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("companyProfile"));
    if (saved) setCompanyProfile(saved);
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/companies")
      .then(res => res.json())
      .then(data => {
        setDb(prev => ({
          ...prev,
          internships: data.data || []
        }));
      });
  }, []);

  const myInts = db.internships;

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
    setErrors({});
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

    const profileRes = await fetch("http://localhost:5000/company-profile");
    const profileData = await profileRes.json();

    const newItem = {
      ...form,
      companyId: userId,
      companyName: profileData?.name || "Company",
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
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar session={{ name: companyProfile?.name || "Company" }} role="company" />

      <div className="flex-1 p-6">

        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Internships</h2>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Post New
          </button>
        </div>

        <div className="grid gap-4">
          {myInts.map(i => (
            <div key={i._id} className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition">

              <div className="flex justify-between">

                <div>
                  <h3 className="font-semibold text-gray-800">{i.title}</h3>
                  <p className="text-blue-600">{i.companyName}</p>

                  <p className="text-sm text-blue-800 flex gap-4 mt-1 items-center">
  <span>📍 {i.location}</span>
  <span>⏱ {i.duration}</span>
</p>

<p className="text-xs text-blue-700 mt-1 flex items-center gap-2">
  📅 {i.deadline}
</p>

                  <div className="flex gap-2 mt-2 flex-wrap">
  {i.skills?.map(s => (
    <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
      {s}
    </span>
  ))}
</div>
                </div>

                <div className="flex gap-2 items-center">
                  <button onClick={() => {
                    setEditItem(i);
                    setForm({ ...i, skills: i.skills.join(", ") });
                    setShowForm(true);
                  }} className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition">Edit</button>

                  <button onClick={() => deleteItem(i._id)} className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition">Delete</button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl w-[420px] shadow-xl border border-blue-100">

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                placeholder="Title"
                value={form.title}
                onChange={e => {
                  setForm({ ...form, title: e.target.value });
                  validateField("title", e.target.value);
                }}
                className={`w-full p-2 border rounded ${errors.title && "border-red-500"}`}
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}

              <input
                placeholder="Location"
                value={form.location}
                onChange={e => {
                  setForm({ ...form, location: e.target.value });
                  validateField("location", e.target.value);
                }}
                className={`w-full p-2 border rounded ${errors.location && "border-red-500"}`}
              />
              {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}

              <input
                placeholder="Duration (3 months)"
                value={form.duration}
                onChange={e => {
                  setForm({ ...form, duration: e.target.value });
                  validateField("duration", e.target.value);
                }}
                className={`w-full p-2 border rounded ${errors.duration && "border-red-500"}`}
              />
              {errors.duration && <p className="text-red-500 text-xs">{errors.duration}</p>}

<input
  type="date"
  value={form.deadline}
  min={new Date().toISOString().split("T")[0]} // 🔥 disable past dates
  onChange={e => {
    const value = e.target.value;
    setForm({ ...form, deadline: value });
    validateField("deadline", value); // optional realtime validation
  }}
  className={`w-full p-2 border rounded ${
    errors.deadline ? "border-red-400" : "border-blue-200"
  }`}
/>
              {errors.deadline && <p className="text-red-500 text-xs">{errors.deadline}</p>}

              <input
                placeholder="Skills (React, Node)"
                value={form.skills}
                onChange={e => {
                  setForm({ ...form, skills: e.target.value });
                  validateField("skills", e.target.value);
                }}
                className={`w-full p-2 border rounded ${errors.skills && "border-red-500"}`}
              />
              {errors.skills && <p className="text-red-500 text-xs">{errors.skills}</p>}

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={e => {
                  setForm({ ...form, description: e.target.value });
                  validateField("description", e.target.value);
                }}
                className={`w-full p-2 border rounded ${errors.description && "border-red-500"}`}
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}

              <button className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white py-2 rounded-lg font-medium shadow-md transition">
                Save
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default CompanyInternships;