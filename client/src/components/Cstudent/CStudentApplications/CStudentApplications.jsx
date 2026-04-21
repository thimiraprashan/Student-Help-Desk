import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar";

const CStudentApplications = ({ userId, studentSession }) => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const loadApplications = async () => {
    if (!userId) {
      setApplications([]);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/applications");
      const data = await res.json();
      const myApps = data.filter((a) => String(a.studentId) === String(userId));
      setApplications(myApps);
    } catch (err) {
      console.log(err);
      setApplications([]);
    }
  };

  useEffect(() => {
    if (!userId) return;

    loadApplications();

    const interval = setInterval(() => {
      loadApplications();
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-indigo-100 text-indigo-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Accepted":
        return "bg-green-100 text-green-600";
      case "Rejected":
        return "bg-red-100 text-red-500";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatInterviewDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatInterviewTime = (time) => {
    if (!time) return "Not scheduled";

    const [hours, minutes] = time.split(":");
    const interviewDate = new Date();
    interviewDate.setHours(Number(hours || 0), Number(minutes || 0), 0, 0);

    return interviewDate.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const handleApplicationClick = (app) => {
    if (app.status !== "Accepted") return;

    setSelectedApplication(app);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        session={{ name: studentSession?.name || "Student" }}
        unreadCount={applications.filter((app) => app.status !== "Accepted").length}
      />

      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Applications 🚀</h2>
          <p className="text-gray-500 text-sm mt-1">
            Track your internship progress and status
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-4 bg-blue-100 text-blue-700 text-xs font-semibold uppercase px-6 py-4 tracking-wide border-b border-blue-200">
            <div>Internship</div>
            <div>Company</div>
            <div>Date</div>
            <div>Status</div>
          </div>

          {applications.map((app, index) => (
            <div
              key={index}
              onClick={() => handleApplicationClick(app)}
              className="group grid grid-cols-4 px-6 py-5 border-t border-blue-100 items-center cursor-pointer
              hover:bg-blue-100 hover:shadow-sm hover:scale-[1.01]
              transition-all duration-300"
            >
              <div className="font-semibold text-gray-800 text-sm">{app.title}</div>

              <div className="text-sm text-blue-600 font-semibold hover:underline cursor-pointer">
                {app.companyName}
              </div>

              <div className="text-sm text-gray-500">{app.date}</div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusStyle(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>

                <span className="ml-3 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-2 transition">
                  →
                </span>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="p-6 text-center text-gray-400">No applications yet</div>
          )}
        </div>
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Interview Scheduled
                </p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">
                  {selectedApplication.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-blue-600">
                  {selectedApplication.companyName}
                </p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200"
              >
                X
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase text-blue-600">Date</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {formatInterviewDate(selectedApplication.interviewDate)}
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase text-blue-600">Time</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {formatInterviewTime(selectedApplication.interviewTime)}
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase text-blue-600">Hall</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {selectedApplication.interviewHall || "Not assigned"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedApplication(null)}
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CStudentApplications;