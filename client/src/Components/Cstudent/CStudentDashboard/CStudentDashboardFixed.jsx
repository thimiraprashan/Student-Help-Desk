import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Common/Sidebar";

const emptyStats = {
  applications: 0,
  accepted: 0,
  openInternships: 0,
  unread: 0,
};

const CStudentDashboardFixed = ({ userId, studentSession }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(emptyStats);
  const [latestInternships, setLatestInternships] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [hasCv, setHasCv] = useState(false);

  const studentName = studentSession?.name || "Student";

  useEffect(() => {
    if (!userId) {
      setStats(emptyStats);
      setLatestInternships([]);
      setRecentApplications([]);
      setHasCv(false);
      return;
    }

    let isActive = true;

    const loadDashboard = async () => {
      try {
        const [internshipsRes, applicationsRes, notificationsRes, cvRes] =
          await Promise.all([
            fetch("http://localhost:5000/companies"),
            fetch("http://localhost:5000/applications"),
            fetch(`http://localhost:5000/notifications/${userId}`),
            fetch(`http://localhost:5000/api/cv/${userId}`),
          ]);

        const internshipsData = await internshipsRes.json();
        const applicationsData = await applicationsRes.json();
        const notificationsData = await notificationsRes.json();
        const cvData = await cvRes.json();

        if (!isActive) return;

        const allInternships = internshipsData.data || [];
        const myApplications = (applicationsData || []).filter(
          (item) => String(item.studentId) === String(userId)
        );
        const unreadNotifications = (notificationsData || []).filter(
          (item) => !item.read
        );

        const sortedApplications = [...myApplications].sort((a, b) =>
          String(b.date || "").localeCompare(String(a.date || ""))
        );

        setStats({
          applications: myApplications.length,
          accepted: myApplications.filter((item) => item.status === "Accepted").length,
          openInternships: allInternships.length,
          unread: unreadNotifications.length,
        });
        setLatestInternships(allInternships.slice(0, 3));
        setRecentApplications(sortedApplications.slice(0, 3));
        setHasCv(Boolean(cvData?._id || cvData?.userId || cvData?.cv));
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, [userId]);

  const dashboardStats = [
    {
      label: "Applications",
      value: stats.applications,
      accent: "from-blue-50 to-sky-100",
      border: "border-blue-200",
      path: "/student/applications",
    },
    {
      label: "Accepted",
      value: stats.accepted,
      accent: "from-emerald-50 to-green-100",
      border: "border-emerald-200",
      path: "/student/applications",
    },
    {
      label: "Open Internships",
      value: stats.openInternships,
      accent: "from-violet-50 to-indigo-100",
      border: "border-violet-200",
      path: "/student/internships",
    },
    {
      label: "Unread",
      value: stats.unread,
      accent: "from-amber-50 to-yellow-100",
      border: "border-amber-200",
      path: "/student/notifications",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Shortlisted":
        return "bg-indigo-100 text-indigo-700";
      case "Rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar session={{ name: studentName }} unreadCount={stats.unread} />

      <div className="flex-1 overflow-auto p-6">
        <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">
            Student Dashboard
          </p>
          <h2 className="mt-4 text-4xl font-bold">{studentName}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Track your applications, latest internships, and profile progress from one
            workspace.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className={`rounded-[1.5rem] border bg-gradient-to-br ${item.accent} ${item.border} p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">{item.value}</h3>
              <p className="mt-3 text-sm text-slate-600">Open</p>
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Latest Internships</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Fresh internship openings available for students.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/student/internships")}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm"
              >
                View all
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {latestInternships.length > 0 ? (
                latestInternships.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-blue-100 bg-white px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm text-blue-700">{item.companyName}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {item.location || "Location pending"} | {item.duration || "Duration pending"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
                  No internships available right now.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">My Applications</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Your latest submitted applications and statuses.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/student/applications")}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm"
              >
                Open list
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {recentApplications.length > 0 ? (
                recentApplications.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-white px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {item.companyName || "Company"} | {item.date || "No date"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status || "Pending"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-indigo-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
                  No applications submitted yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`mt-8 flex flex-col items-start justify-between gap-4 rounded-[2rem] border p-6 shadow-sm sm:flex-row sm:items-center ${
            hasCv
              ? "border-emerald-200 bg-emerald-50"
              : "border-yellow-300 bg-yellow-50"
          }`}
        >
          <div>
            <h4
              className={`text-lg font-semibold ${
                hasCv ? "text-emerald-700" : "text-yellow-700"
              }`}
            >
              {hasCv ? "CV Ready" : "CV Not Uploaded"}
            </h4>
            <p className="mt-2 text-sm text-slate-600">
              {hasCv
                ? "Your profile is ready for companies to review when you apply."
                : "Upload your CV so companies can view it when you apply."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/student/cv")}
            className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
              hasCv
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {hasCv ? "Open Profile" : "Upload CV"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CStudentDashboardFixed;
