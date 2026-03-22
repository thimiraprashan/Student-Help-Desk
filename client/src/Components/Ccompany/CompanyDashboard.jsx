import React from "react";
import Sidebar from "../Common/SSidebar";

const CompanyDashboard = () => {

  return (
    <div className="flex min-h-screen bg-[#020617]">

      {/* Sidebar */}
      <Sidebar session={{ name: "TechCorp Lanka" }} unreadCount={1} />

      {/* Main */}
      <div className="flex-1 p-8 text-white">

        {/* Title */}
        <h2 className="text-3xl font-bold mb-8">
          TechCorp Lanka Dashboard
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Card 1 */}
          <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center text-xl">
              💼
            </div>
            <div>
              <p className="text-slate-400 text-xs">MY INTERNSHIPS</p>
              <h3 className="text-2xl font-bold">2</h3>
              <p className="text-xs text-slate-500">0 pending</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <p className="text-slate-400 text-xs">TOTAL APPLICANTS</p>
              <h3 className="text-2xl font-bold">2</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center text-xl">
              ✅
            </div>
            <div>
              <p className="text-slate-400 text-xs">ACCEPTED</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center text-xl">
              ⭐
            </div>
            <div>
              <p className="text-slate-400 text-xs">AVG RATING</p>
              <h3 className="text-2xl font-bold">5/5</h3>
            </div>
          </div>

        </div>

        {/* Reviews Section */}
        <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800">

          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            ⭐ Recent Student Reviews
          </h3>

          <div className="flex justify-between items-start">

            <div>
              <h4 className="font-semibold mb-1">
                Sasangi Perera
              </h4>

              <p className="text-slate-400 text-sm">
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