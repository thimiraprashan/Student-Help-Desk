import React, { useState } from "react";

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

  const myInts = db.internships.filter(i => i.companyId === userId);

  // RESET
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
  };

  // SAVE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      ...form,
      id: editItem ? editItem.id : Date.now(),
      companyId: userId,
      approved: false,
      skills: form.skills
        ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
        : []
    };

    if (editItem) {
      setDb(prev => ({
        ...prev,
        internships: prev.internships.map(i =>
          i.id === editItem.id ? newItem : i
        )
      }));
    } else {
      setDb(prev => ({
        ...prev,
        internships: [...prev.internships, newItem]
      }));
    }

    resetForm();
  };

  // DELETE
  const deleteItem = (id) => {
    setDb(prev => ({
      ...prev,
      internships: prev.internships.filter(i => i.id !== id)
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ✅ FIXED SIDEBAR */}
      <Sidebar
        session={{ name: "TechCorp Lanka" }}
        unreadCount={1}
        role="company"
      />

      {/* CONTENT */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            My Internships
          </h2>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Post New
          </button>
        </div>

        {/* EMPTY */}
        {myInts.length === 0 && (
          <p className="text-gray-500">No internships yet.</p>
        )}

        {/* LIST */}
        <div className="grid gap-4">
          {myInts.map(i => (
            <div
              key={i.id}
              className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm"
            >

              <div className="flex justify-between items-start">

                {/* LEFT */}
                <div>
                  <h3 className="font-semibold text-gray-800">{i.title}</h3>

                  <p className="text-sm text-gray-500 mt-1">
                    📍 {i.location} · ⏱ {i.duration}
                  </p>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {i.skills.map(s => (
                      <span
                        key={s}
                        className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RIGHT BUTTONS */}
                <div className="flex gap-2">

                  {/* ✅ GREEN EDIT */}
                  <button
                    onClick={() => {
                      setEditItem(i);
                      setForm({
                        ...i,
                        skills: i.skills.join(", ")
                      });
                      setShowForm(true);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  {/* ✅ RED DELETE */}
                  <button
                    onClick={() => deleteItem(i.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-lg border border-blue-100">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editItem ? "Edit Internship" : "Post Internship"}
              </h3>

              <button onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-blue-100 rounded-lg bg-blue-50"
                required
              />

              <select
                value={form.field}
                onChange={e => setForm({ ...form, field: e.target.value })}
                className="w-full px-3 py-2 border border-blue-100 rounded-lg bg-blue-50"
              >
                <option>IT</option>
                <option>Engineering</option>
                <option>Business</option>
              </select>

              <input
                placeholder="Location"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 border border-blue-100 rounded-lg bg-blue-50"
              />

              <input
                placeholder="Duration"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                className="w-full px-3 py-2 border border-blue-100 rounded-lg bg-blue-50"
              />

              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-blue-100 rounded-lg bg-blue-50"
              />

              <input
                placeholder="Skills (React, Node)"
                value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })}
                className="w-full px-3 py-2 border border-blue-100 rounded-lg bg-blue-50"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-blue-100 rounded-lg bg-blue-50"
              />

              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs p-3 rounded-lg">
                ⚠️ Admin approval required
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompanyInternships;