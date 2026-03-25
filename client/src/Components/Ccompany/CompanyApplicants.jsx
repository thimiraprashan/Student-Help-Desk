import React, { useEffect, useState } from "react";
import Sidebar from "../Common/SSidebar";

const CompanyApplicants = () => {

  const [applications, setApplications] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const companyId = 1;

  const loadApplications = () => {
    fetch("http://localhost:5000/applications")
      .then(res => res.json())
      .then(data => {
        const myApps = data.filter(
          (a) => a.companyId && String(a.companyId) === String(companyId)
        );
        setApplications(myApps);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar session={{ name: "Company" }} role="company" />

      <div className="flex-1 p-6">

        <h2 className="text-2xl text-gray-800 mb-6">Applicants</h2>

        {applications.length === 0 && (
          <p className="text-gray-500">No applicants yet</p>
        )}

        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-4 flex justify-between items-center shadow-sm border border-blue-200 hover:shadow-md transition"
          >

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                {app.studentName?.[0]}
              </div>

              <div>
                {/* 🔥 FIXED NAME */}
                <h3 className="text-gray-900 font-semibold">
                  {app.studentName}
                </h3>

                <p className="text-sm text-blue-700">
                  {app.field} · Year {app.year} · GPA {app.gpa}
                </p>

                <p className="text-sm text-blue-700">
                  Applied for: {app.title}
                </p>

                <p className="text-xs text-blue-600">
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
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
              >
                <option value="Pending">Pending</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={() => setSelectedStudent(app)}
                className="border border-blue-200 px-3 py-1 rounded text-blue-700 text-sm hover:bg-blue-100 transition"
              >
                View Profile
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* 🔥 MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-gradient-to-br from-white to-blue-50 w-[500px] rounded-2xl shadow-xl p-6 relative border border-blue-100">

            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-3 right-4 text-blue-400 hover:text-blue-600 text-xl"
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
      )}

    </div>
  );
};

export default CompanyApplicants;