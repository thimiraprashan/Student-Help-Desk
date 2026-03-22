import React from "react";
import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa"; // ✅ FIX

const Sidebar = ({ session, unreadCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "item active" : "item";
  };

  return (
    <div className="sidebar">

      <div className="logo">
        <div className="logo-icon">
          <FaGraduationCap />
        </div>
        <div className="logo-text">
          <h2>CareerGuide</h2>
          <p>LMS Module</p>
        </div>
      </div>

      <div className="user">
        <div className="avatar">
          {session?.name ? session.name[0].toUpperCase() : "S"}
        </div>
        <div className="user-info">
          <h4>{session?.name || "User"}</h4>
          <span className="badge-role">STUDENT</span>
        </div>
      </div>

      <div className="menu">
        <div className={isActive("/student/dashboard")} onClick={() => navigate("/student/dashboard")}>
          🏠 Dashboard
        </div>

        <div className={isActive("/student/internships")} onClick={() => navigate("/student/internships")}>
          🔍 Search Internships
        </div>

        <div className={isActive("/student/applications")} onClick={() => navigate("/student/applications")}>
          📄 My Applications
        </div>

        <div className={isActive("/student/cv")} onClick={() => navigate("/student/cv")}>
          📑 Profile & CV
        </div>

        <div className={isActive("/student/feedback")} onClick={() => navigate("/student/feedback")}>
          💬 My Feedback
        </div>

        <div className={isActive("/student/notifications") + " notification"} onClick={() => navigate("/student/notifications")}>
          🔔 Notifications
          <span className="badge">{unreadCount || 0}</span>
        </div>
      </div>

      <div className="logout">🚪 Sign Out</div>

    </div>
  );
};

export default Sidebar;