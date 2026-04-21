import React, { useEffect, useState } from "react";
import Sidebar from "../Common/SSidebar";
import { getCompanySession } from "../../utils/sessionStore";
import { withBackendUrl } from "../../lib/backend.js";

const CompanyApplicants = ({ userId }) => {
  const [applications, setApplications] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [companyName, setCompanyName] = useState("Company");
  const [interviewApp, setInterviewApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewHall: ""
  });
  const [isEditingInterview, setIsEditingInterview] = useState(false);
  const [interviewErrors, setInterviewErrors] = useState({});

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

  const updateApplicationStatus = async (app, status, details = {}) => {
    const res = await fetch(`http://localhost:5000/applications/${app._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status, ...details })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Unable to update application.");
    }

    const data = await res.json();
    const updatedApplication = data.application || { ...app, status, ...details };

    setApplications((prev) =>
      prev.map((item) =>
        String(item._id) === String(app._id) ? { ...item, ...updatedApplication } : item
      )
    );

    loadApplications();
    return updatedApplication;
  };

  const hasInterviewDetails = (app) =>
    Boolean(app?.interviewDate && app?.interviewTime && app?.interviewHall);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const validateInterviewForm = () => {
    const errors = {};
    const hall = interviewForm.interviewHall.trim();

    if (!interviewForm.interviewDate) {
      errors.interviewDate = "Interview date is required.";
    } else if (interviewForm.interviewDate < getTodayDate()) {
      errors.interviewDate = "Interview date cannot be in the past.";
    }

    if (!interviewForm.interviewTime) {
      errors.interviewTime = "Interview time is required.";
    } else if (interviewForm.interviewDate === getTodayDate()) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      if (interviewForm.interviewTime <= currentTime) {
        errors.interviewTime = "Interview time must be later than the current time.";
      }
    }

    if (!hall) {
      errors.interviewHall = "Hall is required.";
    } else if (hall.length < 3) {
      errors.interviewHall = "Hall must be at least 3 characters.";
    }

    setInterviewErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openInterviewDetails = (app) => {
    setInterviewApp(app);
    setIsEditingInterview(!hasInterviewDetails(app));
    setInterviewErrors({});
    setInterviewForm({
      interviewDate: app.interviewDate || "",
      interviewTime: app.interviewTime || "",
      interviewHall: app.interviewHall || ""
    });
  };

  const saveInterviewDetails = async (e) => {
    e.preventDefault();

    if (!interviewApp) return;
    if (!validateInterviewForm()) return;

    const cleanForm = {
      interviewDate: interviewForm.interviewDate,
      interviewTime: interviewForm.interviewTime,
      interviewHall: interviewForm.interviewHall.trim()
    };

    try {
      const updatedApplication = await updateApplicationStatus(interviewApp, "Accepted", cleanForm);
      setInterviewApp(updatedApplication);
      setInterviewForm({
        interviewDate: updatedApplication.interviewDate || cleanForm.interviewDate,
        interviewTime: updatedApplication.interviewTime || cleanForm.interviewTime,
        interviewHall: updatedApplication.interviewHall || cleanForm.interviewHall
      });
      setIsEditingInterview(false);
    } catch (err) {
      setInterviewErrors((prev) => ({
        ...prev,
        form: err.message || "Unable to save interview details."
      }));
    }
  };

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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {applications.map((app) => (
          <div
            key={app._id}
            className="rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white">
                {app.studentName?.[0]}
              </div>

              <div className="min-w-0">
                {/* 🔥 FIXED NAME */}
                <h3 className="break-words text-2xl font-bold text-slate-900">
                  {app.studentName}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {app.field} · Year {app.year} · GPA {app.gpa}
                </p>

                <p className="mt-2 break-words text-sm font-medium text-blue-600">
                  Applied for: {app.title}
                </p>

                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-slate-400">
                  {app.date}
                </p>

                {app.status === "Accepted" && (
                  <div
                    className={`mt-3 rounded-xl border px-3 py-2 text-sm font-medium ${
                      hasInterviewDetails(app)
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-yellow-200 bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {hasInterviewDetails(app)
                      ? `Interview: ${app.interviewDate} at ${app.interviewTime} - ${app.interviewHall}`
                      : "Interview details not added yet"}
                  </div>
                )}
              </div>

            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">

              <select
                value={app.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;

                  if (newStatus === "Accepted") {
                    openInterviewDetails(app);
                    return;
                  }

                  try {
                    await updateApplicationStatus(app, newStatus);
                  } catch (err) {
                    alert(err.message || "Unable to update application status.");
                  }
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

              {app.status === "Accepted" && (
                <button
                  onClick={() => openInterviewDetails(app)}
                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  {hasInterviewDetails(app) ? "View Interview Details" : "Add Interview Details"}
                </button>
              )}

            </div>

          </div>
        ))}
        </div>

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
                href={withBackendUrl(selectedStudent.cv)}
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

      {interviewApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 px-4 py-6">
          <div className="mx-auto flex min-h-full max-w-xl items-center justify-center">
            <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">Interview Details</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {interviewApp.studentName}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {isEditingInterview
                    ? "Add or update the interview date, time, and hall."
                    : "Company interview details saved for this accepted application."}
                </p>
              </div>

              {!isEditingInterview ? (
                <>
                  <div className="grid gap-3 text-sm">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-xs font-semibold uppercase text-blue-600">Interview Date</p>
                      <p className="mt-1 font-semibold text-slate-800">{interviewApp.interviewDate}</p>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-xs font-semibold uppercase text-blue-600">Interview Time</p>
                      <p className="mt-1 font-semibold text-slate-800">{interviewApp.interviewTime}</p>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-xs font-semibold uppercase text-blue-600">Hall</p>
                      <p className="mt-1 font-semibold text-slate-800">{interviewApp.interviewHall}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setInterviewApp(null)}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInterviewErrors({});
                        setIsEditingInterview(true);
                      }}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Edit Details
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={saveInterviewDetails}>
                  <div className="grid gap-4">
                    <label className="text-sm font-medium text-slate-700">
                      Interview Date
                      <input
                        type="date"
                        required
                        min={getTodayDate()}
                        value={interviewForm.interviewDate}
                        onChange={(e) => {
                          setInterviewForm((prev) => ({ ...prev, interviewDate: e.target.value }));
                          setInterviewErrors((prev) => ({ ...prev, interviewDate: "" }));
                        }}
                        className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                          interviewErrors.interviewDate ? "border-red-400" : "border-slate-300"
                        }`}
                      />
                      {interviewErrors.interviewDate && (
                        <p className="mt-1 text-xs text-red-500">{interviewErrors.interviewDate}</p>
                      )}
                    </label>

                    <label className="text-sm font-medium text-slate-700">
                      Interview Time
                      <input
                        type="time"
                        required
                        value={interviewForm.interviewTime}
                        onChange={(e) => {
                          setInterviewForm((prev) => ({ ...prev, interviewTime: e.target.value }));
                          setInterviewErrors((prev) => ({ ...prev, interviewTime: "" }));
                        }}
                        className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                          interviewErrors.interviewTime ? "border-red-400" : "border-slate-300"
                        }`}
                      />
                      {interviewErrors.interviewTime && (
                        <p className="mt-1 text-xs text-red-500">{interviewErrors.interviewTime}</p>
                      )}
                    </label>

                    <label className="text-sm font-medium text-slate-700">
                      Hall
                      <input
                        type="text"
                        required
                        minLength={3}
                        placeholder="Example: Main Hall A"
                        value={interviewForm.interviewHall}
                        onChange={(e) => {
                          setInterviewForm((prev) => ({ ...prev, interviewHall: e.target.value }));
                          setInterviewErrors((prev) => ({ ...prev, interviewHall: "" }));
                        }}
                        className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-blue-500 ${
                          interviewErrors.interviewHall ? "border-red-400" : "border-slate-300"
                        }`}
                      />
                      {interviewErrors.interviewHall && (
                        <p className="mt-1 text-xs text-red-500">{interviewErrors.interviewHall}</p>
                      )}
                    </label>
                  </div>

                  {interviewErrors.form && (
                    <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                      {interviewErrors.form}
                    </p>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (hasInterviewDetails(interviewApp)) {
                          setIsEditingInterview(false);
                          setInterviewErrors({});
                          return;
                        }

                        setInterviewApp(null);
                      }}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      {hasInterviewDetails(interviewApp) ? "Save Changes" : "Send Accepted"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompanyApplicants;
