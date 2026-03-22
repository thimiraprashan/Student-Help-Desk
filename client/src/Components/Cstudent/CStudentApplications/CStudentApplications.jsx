import React from "react";
import Sidebar from "../../Common/Sidebar";

const CStudentApplications = () => {

  const applications = [
    {
      title: "Software Engineer Intern",
      company: "TechCorp Lanka",
      date: "2026-03-10",
      status: "Shortlisted"
    },
    {
      title: "Civil Engineering Intern",
      company: "BuildPro Engineers",
      date: "2026-03-08",
      status: "Pending"
    },
    {
      title: "UI/UX Intern",
      company: "Creative Labs",
      date: "2026-03-05",
      status: "Rejected"
    }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-indigo-100 text-indigo-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Accepted":
        return "bg-green-100 text-green-600";
      case "Rejected":
        return "bg-red-100 text-red-500";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar session={{ name: "Sasangi Perera" }} unreadCount={2} />

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Applications
        </h2>

        <div className="bg-blue-50 border border-blue-100 rounded-xl shadow-sm overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-4 bg-blue-100 text-gray-600 text-xs font-semibold uppercase px-5 py-3">
            <div>Internship</div>
            <div>Company</div>
            <div>Date</div>
            <div>Status</div>
          </div>

          {/* Rows */}
          {applications.map((app, index) => (
            <div
              key={index}
              className="grid grid-cols-4 px-5 py-4 border-t border-blue-100 items-center hover:bg-blue-50 transition"
            >
              <div className="font-semibold text-gray-800 text-sm">
                {app.title}
              </div>

              <div className="text-sm text-gray-600">
                {app.company}
              </div>

              <div className="text-sm text-gray-500">
                {app.date}
              </div>

              <div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusStyle(app.status)}`}
                >
                  {app.status}
                </span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default CStudentApplications;