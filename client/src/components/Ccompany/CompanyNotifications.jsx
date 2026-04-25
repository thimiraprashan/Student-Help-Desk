import React, { useEffect, useState } from "react";
import Sidebar from "../Common/SSidebar";
import { getCompanySession } from "../../utils/sessionStore";
// ✅ IMPORTANT (correct path check karanna)

const CompanyNotifications = ({ db, userId, setDb }) => {
  const [companyName, setCompanyName] = useState("Company");
  const notifs = db.notifications.filter(n => n.toUserId === userId);
  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const savedSession = getCompanySession();
    if (savedSession) {
      try {
        if (savedSession?.name) {
          setCompanyName(savedSession.name);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const markAll = () => {
    setDb(d => ({
      ...d,
      notifications: d.notifications.map(n =>
        n.toUserId === userId ? { ...n, read: true } : n
      )
    }));
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* ✅ SIDEBAR */}
      <Sidebar
        session={{ name: companyName }}
        unreadCount={notifs.filter(n => !n.read).length}
        role="company"
      />

      {/* CONTENT */}
      <div className="flex-1 p-6 lg:p-8">

        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-blue-500">
                Notification Center
              </p>
              <h2 className="mt-3 text-4xl font-bold text-slate-900">
                Notifications
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Stay updated when application statuses change or new activity happens.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl bg-blue-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">Unread</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{unreadCount}</p>
              </div>
              <button
                onClick={markAll}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Mark all read
              </button>
            </div>
          </div>
        </div>

        {/* LIST */}
        {notifs.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">No notifications</h3>
            <p className="mt-3 text-sm text-slate-500">
              Company notifications will appear here when there is new activity.
            </p>
          </div>
        )}

        {notifs.map(n => (
          <div
            key={n.id}
            className={`mb-4 rounded-[2rem] border p-5 shadow-sm transition ${
              n.read
                ? "border-slate-200 bg-white"
                : "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50"
            }`}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-base font-medium text-slate-800">{n.message}</p>
                <small className="mt-2 block text-xs uppercase tracking-[0.15em] text-slate-400">
                  {n.read ? "Read" : "Unread"}
                </small>
              </div>
              <small className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-500">
                {n.date}
              </small>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CompanyNotifications;
