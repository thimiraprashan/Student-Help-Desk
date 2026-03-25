import React from "react";
import Sidebar from "../Common/SSidebar";

const CompanyDashboard = () => {

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar session={{ name: "TechCorp Lanka" }} unreadCount={1} />

      {/* Main */}
      <div className="flex-1 p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          TechCorp Lanka Dashboard
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Card 1 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center text-xl">
              💼
            </div>
            <div>
              <p className="text-blue-700 text-xs font-medium">MY INTERNSHIPS</p>
              <h3 className="text-2xl font-bold text-gray-800">2</h3>
              <p className="text-xs text-blue-600">0 pending</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <p className="text-blue-700 text-xs font-medium">TOTAL APPLICANTS</p>
              <h3 className="text-2xl font-bold text-gray-800">2</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center text-xl">
              ✅
            </div>
            <div>
              <p className="text-blue-700 text-xs font-medium">ACCEPTED</p>
              <h3 className="text-2xl font-bold text-gray-800">0</h3>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 shadow-sm flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center text-xl">
              ⭐
            </div>
            <div>
              <p className="text-blue-700 text-xs font-medium">AVG RATING</p>
              <h3 className="text-2xl font-bold text-gray-800">5/5</h3>
            </div>
          </div>

        </div>

        {/* Reviews Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition">

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