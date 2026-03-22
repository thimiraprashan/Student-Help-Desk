import React from "react";
import Sidebar from "../../Common/Sidebar";
import "./CStudentApplications.css";

const StudentApplications = () => {
  const applications = [
    {
      id: 1,
      internship: "Software Engineer Intern",
      company: "TechCorp Lanka",
      appliedDate: "2025-01-10",
      status: "shortlisted",
      interviewDate: "2025-02-05",
    },
  ];

  return (
    <div className="layout">

      {/* Sidebar — props දාන්න අමතක කරන්නෙපා */}
      <Sidebar session={{ name: "Sasangi Perera" }} unreadCount={2} />

      {/* Main Content */}
      <div className="content">
        <h1 className="title">My Applications</h1>

        <div className="table-card">
          <table className="table">
            <thead>
              <tr>
                <th>INTERNSHIP</th>
                <th>COMPANY</th>
                <th>APPLIED</th>
                <th>STATUS</th>
                <th>INTERVIEW</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((a) => (
                <tr key={a.id}>
                  <td className="internship">{a.internship}</td>
                  <td>{a.company}</td>
                  <td>{a.appliedDate}</td>
                  <td>
                    <span className={`status ${a.status}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>{a.interviewDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default StudentApplications;