import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ session, unreadCount = 0, role = "company" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ MENU SWITCH
  const menu =
    role === "company"
      ? [
          { name: "Dashboard", path: "/company/dashboard", icon: "🏠" },
          { name: "My Internships", path: "/company/internships", icon: "💼" },
          { name: "Applicants", path: "/company/applicants", icon: "👥" },
          { name: "Notifications", path: "/company/notifications", icon: "🔔" },
        ]
      : [
          { name: "Dashboard", path: "/student/dashboard", icon: "🏠" },
          { name: "Search Internships", path: "/student/internships", icon: "🔍" },
          { name: "My Applications", path: "/student/applications", icon: "📄" },
          { name: "Profile & CV", path: "/student/cv", icon: "👤" },
          { name: "Messages", path: "/student/messages", icon: "💬" },
          { name: "Notifications", path: "/student/notifications", icon: "🔔" },
        ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-[260px] min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-white flex flex-col justify-between border-r border-slate-800">

      {/* TOP */}
      <div>

        {/* Logo */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl">
            🎓
          </div>
          <div>
            <h1 className="font-bold text-sm">CareerGuide</h1>
            <p className="text-xs text-slate-400">LMS Module</p>
          </div>
        </div>

        {/* Profile */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold">
            {session?.name?.[0] || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold">{session?.name}</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                role === "company"
                  ? "bg-blue-900 text-blue-300"
                  : "bg-green-900 text-green-300"
              }`}
            >
              {role === "company" ? "COMPANY" : "STUDENT"}
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="p-3 space-y-2">
          {menu.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition
                ${
                  isActive(item.path)
                    ? "bg-indigo-600/20 border border-indigo-500 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </div>

              {/* Notification badge */}
              {item.name === "Notifications" && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Bottom */}
      <div className="p-4">
        <button className="w-full border border-slate-700 text-slate-300 py-3 rounded-xl hover:bg-slate-800 transition">
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;