import React from "react";
import Sidebar from "../../Common/Sidebar";
import "./CStudentInternships.css";

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
    <div className="layout">

      <Sidebar session={{ name: "Sasangi Perera" }} unreadCount={2} />

      <div className="content">
        <div className="container">

          <h2 className="page-title">Search Internships</h2>

          {/* Search */}
          <div className="search-bar">
            <input placeholder="Search internships..." />
            <select>
              <option>All Fields</option>
              <option>IT</option>
              <option>Engineering</option>
              <option>Business</option>
            </select>
          </div>

          {/* Cards */}
          <div className="card-grid">
            {internships.map((i, index) => (
              <div className="card" key={index}>

                <div className="top">
                  <div className="logo">{i.company[0]}</div>
                  <span className="status">ACTIVE</span>
                </div>

                <h3 className="title">{i.title}</h3>
                <p className="company">{i.company}</p>

                <div className="tags">
                  <span>📍 {i.location}</span>
                  <span>⏱ {i.duration}</span>
                  <span>🏷 {i.field}</span>
                </div>

                <div className="skills">
                  {i.skills.map((s, idx) => (
                    <span key={idx}>{s}</span>
                  ))}
                </div>

                <p className="deadline">📅 Deadline: 2025-03-15</p>

                <div className="buttons">
                  {i.applied ? (
                    <button className="applied">✓ Applied</button>
                  ) : (
                    <button className="apply">Apply Now</button>
                  )}
                  <button className="view">View Company</button>
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