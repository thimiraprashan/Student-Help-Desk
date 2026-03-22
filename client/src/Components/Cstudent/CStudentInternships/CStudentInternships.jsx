import React from "react";
import Sidebar from "../../Common/Sidebar";

const CStudentInternships = () => {

  const internships = [
    {
      title: "Software Engineer Intern",
      company: "TechCorp Lanka",
      location: "Colombo",
      duration: "3 months",
      field: "IT",
      skills: ["React", "Node.js"],
      applied: true
    },
    {
      title: "Civil Engineering Intern",
      company: "BuildPro Engineers",
      location: "Kandy",
      duration: "6 months",
      field: "Engineering",
      skills: ["AutoCAD", "CAD"],
      applied: false
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar session={{ name: "Sasangi Perera" }} unreadCount={2} />

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Search Internships
          </h2>

          {/* 🔍 Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">

            <input
              placeholder="Search internships..."
              className="flex-1 px-4 py-2 border border-blue-100 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <select className="px-4 py-2 border border-blue-100 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option>All Fields</option>
              <option>IT</option>
              <option>Engineering</option>
              <option>Business</option>
            </select>

          </div>

          {/* 🔥 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {internships.map((i, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm flex flex-col gap-3 hover:shadow-md hover:-translate-y-1 transition"
              >

                {/* Top */}
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                    {i.company[0]}
                  </div>

                  <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-semibold">
                    ACTIVE
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-800 text-sm">
                  {i.title}
                </h3>

                <p className="text-sm text-blue-600">
                  {i.company}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <span className="bg-white border px-2 py-1 rounded-full">📍 {i.location}</span>
                  <span className="bg-white border px-2 py-1 rounded-full">⏱ {i.duration}</span>
                  <span className="bg-white border px-2 py-1 rounded-full">🏷 {i.field}</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {i.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Deadline */}
                <p className="text-xs text-gray-400">
                  📅 Deadline: 2025-03-15
                </p>

                {/* Buttons */}
                <div className="flex gap-2 mt-2">

                  {i.applied ? (
                    <button className="flex-1 border border-gray-300 text-gray-500 px-3 py-1 rounded-lg text-sm">
                      ✓ Applied
                    </button>
                  ) : (
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                      Apply Now
                    </button>
                  )}

                  <button className="flex-1 border border-gray-300 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-100">
                    View
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
};

export default CStudentInternships;