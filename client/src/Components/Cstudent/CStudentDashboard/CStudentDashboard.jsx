import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Common/Sidebar";
import "./CStudentDashboard.css";

const CStudentDashboard = () => {   // ✅ NAME FIXED

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
    <div className="layout">

      {/* Sidebar */}
      <Sidebar session={{ name: user.name }} unreadCount={2} />

      {/* Dashboard */}
      <div className="dashboard">

        <h2>Welcome back, {user.name}!</h2>
        <p className="sub">Your career journey at a glance.</p>

        {/* Stats */}
        <div className="stats">
          {stats.map((s, i) => (
            <div key={i} className="card">
              <div className="icon">{s.icon}</div>
              <div>
                <p className="label">{s.label}</p>
                <h3>{s.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid">

          <div className="box">
            <h3>🔥 Latest Internships</h3>
            {internships.map((i, index) => (
              <div key={index} className="item">
                <p className="title">{i.title}</p>
                <p className="details">{i.company} · {i.details}</p>
              </div>
            ))}
          </div>

          <div className="box">
            <h3>📬 My Applications</h3>
            <div className="item flex">
              <span>Software Engineer Intern</span>
              <span className="badge">SHORTLISTED</span>
            </div>
          </div>

        </div>

        {/* CV Box */}
        <div className="cv-box">
          <div>
            <h4>⚠️ CV Not Uploaded</h4>
            <p>Upload your CV so companies can view it when you apply.</p>
          </div>

          <button onClick={() => navigate("/student/cv")}>
            Upload CV
          </button>
        </div>

      </div>
    </div>
  );
};

export default CStudentDashboard; // ✅ NAME FIXED