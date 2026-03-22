import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import CStudentDashboard from "./Components/Cstudent/CStudentDashboard/CStudentDashboard";
import CStudentInternships from "./Components/Cstudent/CStudentInternships/CStudentInternships";
import CStudentApplications from "./Components/Cstudent/CStudentApplications/CStudentApplications";
import StudentCV from "./Components/Cstudent/CStudentCV/CStudentCV";
import CSguidence from "./Components/Cstudent/CSguidence/CSguidence";

function App() {
  return (
    <Routes>

      {/* Redirect */}
      <Route path="/" element={<Navigate to="/student/dashboard" />} />

      {/* Student Pages */}
      <Route path="/student/dashboard" element={<CStudentDashboard />} />
      <Route path="/student/internships" element={<CStudentInternships />} />
      <Route path="/student/applications" element={<CStudentApplications />} />
      <Route path="/student/cv" element={<StudentCV />} />

      {/* Guidance */}
      <Route path="/student/guidance" element={<CSguidence />} />
      <Route path="/student/feedback" element={<CSguidence />} />

      {/* 404 */}
      <Route path="*" element={<h2 style={{ color: "white" }}>Page Not Found</h2>} />

    </Routes>
  );
}

export default App;