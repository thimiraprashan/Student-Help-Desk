import React, { useEffect, useState } from "react";
import Sidebar from "../Common/SSidebar";

const CompanyDashboard = ({ userId, session }) => {
  const [stats, setStats] = useState({
    internships: 0,
    applicants: 0,
    accepted: 0,
    pending: 0,
  });

  const companyName = session?.name || "Company";

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [companyRes, applicationsRes] = await Promise.all([
          fetch("http://localhost:5000/companies"),
          fetch("http://localhost:5000/applications"),
        ]);

        const companiesData = await companyRes.json();
        const applicationsData = await applicationsRes.json();

        const myInternships = (companiesData.data || []).filter(
          (item) => String(item.companyId) === String(userId)
        );
        const myApplications = (applicationsData || []).filter(
          (item) => String(item.companyId) === String(userId)
        );

        setStats({
          internships: myInternships.length,
          applicants: myApplications.length,
          accepted: myApplications.filter((item) => item.status === "Accepted").length,
          pending: myApplications.filter(
            (item) => !item.status || item.status === "Pending"
          ).length,
        });
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, [userId]);

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar session={{ name: companyName }} unreadCount={0} role="company" />

      {/* Main */}
      <div className="flex-1 p-6 lg:p-8">

        {/* Title */}
        <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">
            Company Dashboard
          </p>
          <h2 className="mt-4 text-4xl font-bold">
            {companyName}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Track internship posts, applicant activity, and hiring progress from one cleaner workspace.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Card 1 */}
          <div className="rounded-[1.75rem] border border-blue-200 bg-gradient-to-br from-sky-50 to-blue-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center text-xl">
              💼
            </div>
            <div>
              <p className="text-blue-700 text-xs font-medium">MY INTERNSHIPS</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.internships}</h3>
              <p className="text-xs text-blue-600">{stats.pending} pending applications</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-[1.75rem] border border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <p className="text-blue-700 text-xs font-medium">TOTAL APPLICANTS</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.applicants}</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-[1.75rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center text-xl">
              ✅
            </div>
            <div>
              <p className="text-blue-700 text-xs font-medium">ACCEPTED</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.accepted}</h3>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-[1.75rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center text-xl">
              ⭐
            </div>
            <div>
              <p className="text-blue-700 text-xs font-medium">PENDING</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.pending}</h3>
            </div>
          </div>

        </div>

        {/* Reviews Section */}
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition">

          <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
            ⭐ Recent Student Reviews
          </h3>

          <div className="flex justify-between items-start">

            <div>
              <h4 className="font-semibold text-gray-800 mb-1">
                Sasangi Perera
              </h4>

              <p className="text-gray-600 text-sm">
                Great internship opportunity! Very professional company.
              </p>
            </div>

            {/* Stars */}
            <div className="text-yellow-400 text-lg">
              ⭐⭐⭐⭐⭐
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CompanyDashboard;
