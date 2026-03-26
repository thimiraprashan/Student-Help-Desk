import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import initialDb from "./data";

/* ================= STUDENT ================= */
import CStudentDashboard from "./Components/Cstudent/CStudentDashboard/CStudentDashboard";
import CStudentInternships from "./Components/Cstudent/CStudentInternships/CStudentInternships";
import CStudentApplications from "./Components/Cstudent/CStudentApplications/CStudentApplications";
import StudentCV from "./Components/Cstudent/CStudentCV/CStudentCV";
import Csguidence from "./Components/Cstudent/CSguidence/CSguidence";
import CStudentNotifications from "./Components/Cstudent/CStudentNotifications/CStudentNotifications";
import CCStudentMessages from "./Components/Cstudent/CStudentMessages/CCStudentMessages";

/* ================= COMPANY ================= */
import CompanyDashboard from "./Components/Ccompany/CompanyDashboard";
import CompanyInternships from "./Components/Ccompany/CompanyInternships";
import CompanyApplicants from "./Components/Ccompany/CompanyApplicants";
import CompanyNotifications from "./Components/Ccompany/CompanyNotifications";
import CCompanyMessages from "./Components/Ccompany/CCompanyMessages";
import CompanyProfile from "./Components/Ccompany/CCompanyProfile";

function App() {

  const [db, setDb] = useState(initialDb);

  const studentId = 1;
  const companyId = 101;

  const showToast = (msg) => alert(msg);

  const threadId = (companyId, studentId) => {
    return `c${companyId}_s${studentId}`;
  };

  const getThread = (companyId, studentId) => {
    return db.messages.filter(
      (m) => m.threadId === threadId(companyId, studentId)
    );
  };

  return (
    <Routes>

      {/* STUDENT */}
      <Route path="/" element={<CStudentDashboard />} />
      <Route path="/student/dashboard" element={<CStudentDashboard />} />
      <Route path="/student/internships" element={<CStudentInternships db={db} setDb={setDb} userId={studentId} />} />
      <Route path="/student/applications" element={<CStudentApplications db={db} userId={studentId} />} />
      <Route path="/student/cv" element={<StudentCV />} />
      <Route path="/student/guidance" element={<Csguidence />} />
      <Route path="/student/feedback" element={<Csguidence />} />
      <Route path="/student/messages" element={<CCStudentMessages db={db} setDb={setDb} userId={studentId} companyId={companyId} />} />
      <Route path="/student/notifications" element={<CStudentNotifications db={db} setDb={setDb} userId={studentId} showToast={showToast} />} />

      {/* COMPANY */}
      <Route path="/company/dashboard" element={<CompanyDashboard db={db} userId={companyId} session={{ name: "Company" }} />} />
      <Route path="/company/internships" element={<CompanyInternships db={db} setDb={setDb} userId={companyId} />} />
      <Route path="/company/applicants" element={<CompanyApplicants db={db} setDb={setDb} userId={companyId} />} />
      <Route path="/company/messages" element={<CCompanyMessages db={db} setDb={setDb} userId={companyId} />} />
      <Route path="/company/notifications" element={<CompanyNotifications db={db} setDb={setDb} userId={companyId} />} />
      <Route path="/company/profile" element={<CompanyProfile />} />

    </Routes>
  );
}

export default App;