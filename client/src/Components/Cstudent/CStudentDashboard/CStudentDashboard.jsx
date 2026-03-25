import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Common/Sidebar";

const CStudentDashboard = () => {

  const navigate = useNavigate();

  const user = { name: "Sasangi Perera" };

  const stats = [
    { label: "Applications", value: 1, icon: "📋" },
    { label: "Accepted", value: 0, icon: "✅" },
    { label: "Open Internships", value: 2, icon: "💼" },
    { label: "Unread", value: 2, icon: "🔔" }
  ];

  const internships = [
    { title: "Software Engineer Intern", company: "TechCorp Lanka", details: "Colombo · 3 months" },
    { title: "Civil Engineering Intern", company: "BuildPro Engineers", details: "Kandy · 6 months" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar session={{ name: user.name }} unreadCount={2} />

      {/* Main */}
      <div className="flex-1 p-6 overflow-auto">

        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user.name}!
        </h2>

        <p className="text-gray-500 mt-1 mb-6">
          Your career journey at a glance.
        </p>

        {/* 🔥 Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="group bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm flex items-center gap-3 cursor-pointer
              
              hover:bg-blue-100 hover:shadow-md hover:scale-[1.03] 
              transition-all duration-300 ease-in-out
              hover:ring-2 hover:ring-blue-300"
            >
              
              {/* ICON */}
              <div className="text-2xl transform group-hover:translate-x-1 transition">
                {s.icon}
              </div>

              {/* TEXT */}
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <h3 className="text-xl font-bold text-gray-800">{s.value}</h3>
              </div>

              {/* 👉 Arrow */}
              <div className="ml-auto text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-2 transition">
                →
              </div>

            </div>
          ))}
        </div>

        {/* 🔥 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Internships */}
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-3">
              🔥 Latest Internships
            </h3>

            {internships.map((i, index) => (
              <div 
                key={index} 
                className="py-3 border-b border-blue-100 last:border-none hover:bg-blue-100 px-2 rounded transition"
              >
                <p className="font-semibold text-gray-700 text-sm">{i.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {i.company} · {i.details}
                </p>
              </div>
            ))}
          </div>

          {/* Applications */}
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800 mb-3">
              📬 My Applications
            </h3>

            <div className="flex justify-between items-center text-sm text-gray-700 hover:bg-blue-100 px-2 py-2 rounded transition">
              <span>Software Engineer Intern</span>
              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
                SHORTLISTED
              </span>
            </div>
          </div>

        </div>

        {/* 🔥 CV Box */}
        <div className="bg-yellow-50 border border-yellow-300 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
        hover:shadow-md transition">

          <div>
            <h4 className="font-semibold text-yellow-700">
              ⚠️ CV Not Uploaded
            </h4>
            <p className="text-sm text-gray-600">
              Upload your CV so companies can view it when you apply.
            </p>
          </div>

          <button
            onClick={() => navigate("/student/cv")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Upload CV
          </button>

        </div>

      </div>
    </div>
  );
};

export default CStudentDashboard;