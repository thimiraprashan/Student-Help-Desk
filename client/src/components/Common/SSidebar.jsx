import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCompanySession, getCompanySession } from "../../utils/sessionStore";

const Sidebar = ({ session, unreadCount = 0, role = "company" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 STATE
  const [companyName, setCompanyName] = useState("Company");

  // 🔥 FUNCTION → FETCH FROM DATABASE
  const loadProfile = async () => {
    try {
      const storedSession = getCompanySession();
      const companyId = storedSession?.companyId;
      if (!companyId) {
        setCompanyName(session?.name || "Company");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/company-profile?companyId=${companyId}`
      );

      if (!res.ok) {
        setCompanyName(session?.name || "Company");
        return;
      }

      const data = await res.json();

      if (data?.name) {
        setCompanyName(data.name);
      } else {
        setCompanyName(session?.name || "Company");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 LOAD ON START
  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (session?.name) {
      setCompanyName(session.name);
    }
  }, [session?.name]);

  // 🔥 LISTEN FOR UPDATE EVENT
  useEffect(() => {
    const handler = () => {
      loadProfile(); // 🔥 re-fetch from DB
    };

    window.addEventListener("profileUpdated", handler);

    return () => window.removeEventListener("profileUpdated", handler);
  }, []);

  // MENU
  const menu =
    role === "company"
      ? [
          { name: "Dashboard", path: "/company/dashboard", icon: "🏠" },
          { name: "My Internships", path: "/company/internships", icon: "💼" },
          { name: "Applicants", path: "/company/applicants", icon: "👥" },
          { name: "Messages", path: "/company/messages", icon: "💬" },
          { name: "Feedback", path: "/company/feedback", icon: "★" },
          { name: "Profile", path: "/company/profile", icon: "👤" },
        ]
      : [];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-[260px] min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-white flex flex-col justify-between">

      <div>

        {/* LOGO */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            🎓
          </div>
          <div>
            <h1 className="text-sm font-bold">CareerGuide</h1>
            <p className="text-xs text-gray-400">LMS Module</p>
          </div>
        </div>

        {/* PROFILE */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold">
            {companyName?.[0]?.toUpperCase()}
          </div>
          <div>
            {/* 🔥 REAL NAME */}
            <p className="text-sm font-semibold">{companyName}</p>

            <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">
              COMPANY
            </span>
          </div>
        </div>

        {/* MENU */}
        <div className="p-3 space-y-2">
          {menu.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                ${
                  isActive(item.path)
                    ? "bg-indigo-600/20 border border-indigo-500"
                    : "hover:bg-slate-800"
                }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.name}</span>

              {item.name === "Notifications" && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-xs px-2 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* SIGN OUT */}
      <div className="p-4">
        <button
          onClick={() => {
            clearCompanySession();
            navigate("/company/login");
          }}
          className="w-full border border-red-500 py-3 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
  Sign Out
</button>
      </div>

    </div>
  );
};

export default Sidebar;