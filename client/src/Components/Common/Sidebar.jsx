import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { clearStudentSession } from "../../utils/sessionStore";

const Sidebar = ({ session, unreadCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const handleSignOut = () => {
    clearStudentSession();
    localStorage.removeItem("student");
    localStorage.removeItem("token");
    window.location.assign("/login");
  };

  return (
    <div className="w-[260px] h-screen bg-[#0b1220] text-white flex flex-col p-5 sticky top-0">

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
          <FaGraduationCap className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">CareerGuide</h2>
          <p className="text-xs text-slate-400">Help Desk Module</p>
        </div>
      </div>

      {/* USER */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-5">
        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">
          {session?.name ? session.name[0].toUpperCase() : "S"}
        </div>
        <div>
          <h4 className="text-sm">{session?.name || "User"}</h4>
          <span className="text-[10px] bg-green-900 text-green-400 px-2 py-0.5 rounded-full">
            STUDENT
          </span>
        </div>
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-2 flex-1">
        {[
          { name: "Dashboard", path: "/student/dashboard", icon: "🏠" },
          { name: "Search Internships", path: "/student/internships", icon: "🔍" },
          { name: "My Applications", path: "/student/applications", icon: "📄" },
          { name: "Profile & CV", path: "/student/cv", icon: "📑" },
          { name: "Choose Your Career Path", path: "/student/feedback", icon: "🚀" },
          { name: "Messages", path: "/student/messages", icon: "💬" },
          { name: "Notifications", path: "/student/notifications", icon: "🔔" },
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
              ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-[1.02]"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
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

      {/* LOGOUT */}
      <div className="mt-4">
        <div
          onClick={handleSignOut}
          className="border border-red-500 py-3 rounded-xl text-center cursor-pointer text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          🚪 Sign Out
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
