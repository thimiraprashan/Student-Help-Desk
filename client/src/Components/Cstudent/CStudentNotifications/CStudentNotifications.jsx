import React, { useEffect } from "react";
import Sidebar from "../../Common/Sidebar";

const CStudentNotifications = ({ db, setDb, userId, showToast }) => {

  // 🔥 LOAD FROM BACKEND → db state update
  const loadNotifications = () => {
    fetch(`http://localhost:5000/notifications/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("BACKEND NOTIFS:", data);

        // 👉 db state update (IMPORTANT)
        setDb(d => ({
          ...d,
          notifications: data || []
        }));
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadNotifications();

    // 🔥 auto refresh
    const interval = setInterval(() => {
      loadNotifications();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 FILTER FROM DB (unchanged)
  const notifs = db.notifications.filter(
    (n) => String(n.toUserId) === String(userId)
  );

  const markAllRead = async () => {

    await Promise.all(
      notifs.map(n =>
        fetch(`http://localhost:5000/notifications/${n._id}/read`, {
          method: "PUT"
        })
      )
    );

    loadNotifications();
    showToast("All marked as read");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar
        session={{ name: "Sasangi Perera" }}
        unreadCount={notifs.filter(n => !n.read).length}
      />

      <div className="flex-1 p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>

          {notifs.some(n => !n.read) && (
            <button
              onClick={markAllRead}
              className="border px-3 py-1 rounded-lg hover:bg-gray-100 text-sm"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifs.map(n => (
            <div
              key={n._id}
              className={`bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4 ${n.read ? "opacity-50" : ""}`}
            >
              <div className="text-xl">🔔</div>

              <div className="flex-1">
                <p className="text-sm text-gray-700">{n.message}</p>
                <p className="text-xs text-gray-500">{n.date}</p>
              </div>

              {!n.read && (
                <button
                  onClick={async () => {
                    await fetch(`http://localhost:5000/notifications/${n._id}/read`, {
                      method: "PUT"
                    });
                    loadNotifications();
                  }}
                  className="text-sm border px-2 py-1 rounded hover:bg-gray-100"
                >
                  ✓
                </button>
              )}
            </div>
          ))}

          {notifs.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              No notifications yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CStudentNotifications;