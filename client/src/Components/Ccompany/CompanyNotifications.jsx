import React from "react";
import Sidebar from "../Common/SSidebar";
// ✅ IMPORTANT (correct path check karanna)

const CompanyNotifications = ({ db, userId, setDb }) => {

  const notifs = db.notifications.filter(n => n.toUserId === userId);

  const markAll = () => {
    setDb(d => ({
      ...d,
      notifications: d.notifications.map(n =>
        n.toUserId === userId ? { ...n, read: true } : n
      )
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ✅ SIDEBAR */}
      <Sidebar
        session={{ name: "TechCorp Lanka" }}
        unreadCount={notifs.filter(n => !n.read).length}
      />

      {/* CONTENT */}
      <div className="flex-1 p-6">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Notifications
          </h2>

          <button
            onClick={markAll}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all read
          </button>
        </div>

        {/* LIST */}
        {notifs.length === 0 && (
          <p className="text-gray-500">No notifications</p>
        )}

        {notifs.map(n => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border mb-3 ${
              n.read
                ? "bg-white opacity-60"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <p className="text-gray-800">{n.message}</p>
            <small className="text-gray-400">{n.date}</small>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CompanyNotifications;