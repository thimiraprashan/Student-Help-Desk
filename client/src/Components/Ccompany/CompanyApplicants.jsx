import React, { useEffect, useState } from "react";
import Sidebar from "../Common/SSidebar";
import { getCompanySession } from "../../utils/sessionStore";

const CompanyApplicants = ({ userId }) => {
  const [applications, setApplications] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [companyName, setCompanyName] = useState("Company");

  const loadApplications = () => {
    fetch("http://localhost:5000/applications")
      .then(res => res.json())
      .then(data => {
        const myApps = data.filter(
          (a) => a.companyId && String(a.companyId) === String(userId)
        );
        setApplications(myApps);
      })
      .catch(err => console.log(err));
  };

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

    loadApplications();

    const interval = setInterval(() => {
      loadApplications();
    }, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar session={{ name: companyName }} role="company" />

      <div className="flex-1 p-6 lg:p-8">

        <div className="mb-8 rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-500">Applicant Pipeline</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">Applicants</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Review student applications and update statuses from one clean list.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-white/60 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-600">Total</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{applications.length}</p>
            </div>
          </div>
        </div>

        {applications.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">No applicants yet</h3>
            <p className="mt-3 text-sm text-slate-500">
              When students apply to this company, they will appear here.
            </p>
          </div>
        )}

        {applications.map((app) => (
          <div
            key={app._id}
            className="mb-4 rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white">
                {app.studentName?.[0]}
              </div>

              <div>
                {/* 🔥 FIXED NAME */}
                <h3 className="text-2xl font-bold text-slate-900">
                  {app.studentName}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {app.field} · Year {app.year} · GPA {app.gpa}
                </p>

                <p className="mt-2 text-sm font-medium text-blue-600">
                  Applied for: {app.title}
                </p>

                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-slate-400">
                  {app.date}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <select
                value={app.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;

                  await fetch(`http://localhost:5000/applications/${app._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ status: newStatus })
                  });

                  loadApplications();
                }}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={() => setSelectedStudent(app)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                View Profile
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* 🔥 MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 px-4 py-6">

          <div className="mx-auto flex min-h-full max-w-2xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">

            <button
              onClick={() => setSelectedStudent(null)}
                className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200"
            >
              ✖
            </button>

            <div className="flex items-center gap-4 mb-6">

              <div className="w-14 h-14 bg-purple-500 text-white flex items-center justify-center rounded-xl text-xl font-bold">
                {selectedStudent.studentName?.[0]}
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {selectedStudent.studentName}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedStudent.studentEmail}
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600">Field</p>
                <p className="font-semibold text-gray-800">
                  {selectedStudent.field}
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600">Year</p>
                <p className="font-semibold text-gray-800">
                  Year {selectedStudent.year}
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600">GPA</p>
                <p className="font-semibold text-green-600">
                  {selectedStudent.gpa}
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600">Role</p>
                <p className="font-semibold text-gray-800">
                  {selectedStudent.title}
                </p>
              </div>

            </div>

            <p className="text-sm text-blue-600 mb-4">
              Applied on: {selectedStudent.date}
            </p>

            {selectedStudent.cv && (
              <a
                href={`http://localhost:5000/${selectedStudent.cv}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 rounded-lg font-medium shadow-md transition"
              >
                📄 View CV
              </a>
            )}

          </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default CompanyApplicants;
