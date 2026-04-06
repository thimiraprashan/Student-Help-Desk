import { useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import initialDb from "./data";

import CStudentDashboard from "./Components/Cstudent/CStudentDashboard/CStudentDashboard";
import CStudentInternships from "./Components/Cstudent/CStudentInternships/CStudentInternships";
import CStudentApplications from "./Components/Cstudent/CStudentApplications/CStudentApplications";
import StudentCV from "./Components/Cstudent/CStudentCV/CStudentCV";
import Csguidence from "./Components/Cstudent/CSguidence/CSguidence";
import CStudentNotifications from "./Components/Cstudent/CStudentNotifications/CStudentNotifications";
import CCStudentMessages from "./Components/Cstudent/CStudentMessages/CCStudentMessages";

import CompanyDashboard from "./Components/Ccompany/CompanyDashboard";
import CompanyInternships from "./Components/Ccompany/CompanyInternships";
import CompanyApplicants from "./Components/Ccompany/CompanyApplicants";
import CompanyNotifications from "./Components/Ccompany/CompanyNotifications";
import CCompanyMessages from "./Components/Ccompany/CCompanyMessages";
import CompanyProfile from "./Components/Ccompany/CCompanyProfile";
import CompanyLogin from "./Components/Ccompany/CompanyLogin";

function App() {
  const [db, setDb] = useState(initialDb);
  const [studentSession, setStudentSession] = useState(() => {
    const saved = localStorage.getItem("studentProfile");
    return saved ? JSON.parse(saved) : { userId: 1, name: "Student" };
  });
  const [companySession, setCompanySession] = useState(() => {
    const saved = localStorage.getItem("companySession");
    return saved ? JSON.parse(saved) : null;
  });

  const studentId = Number(studentSession?.userId || 1);
  const companyId = companySession?.companyId || 101;

  const showToast = (msg) => alert(msg);
  const requireCompanyAuth = (element) =>
    companySession ? element : <Navigate to="/company/login" replace />;

  return (
    <Routes>
      <Route path="/" element={<CStudentDashboard userId={studentId} studentSession={studentSession} />} />
      <Route path="/student/dashboard" element={<CStudentDashboard userId={studentId} studentSession={studentSession} />} />
      <Route path="/student/internships" element={<CStudentInternships db={db} setDb={setDb} userId={studentId} studentSession={studentSession} />} />
      <Route path="/student/applications" element={<CStudentApplications db={db} userId={studentId} studentSession={studentSession} />} />
      <Route path="/student/cv" element={<StudentCV userId={studentId} onStudentProfileChange={setStudentSession} studentSession={studentSession} />} />
      <Route path="/student/guidance" element={<Csguidence userId={studentId} studentSession={studentSession} />} />
      <Route path="/student/feedback" element={<Csguidence userId={studentId} studentSession={studentSession} />} />
      <Route path="/student/messages" element={<CCStudentMessages db={db} setDb={setDb} userId={studentId} />} />
      <Route path="/student/notifications" element={<CStudentNotifications db={db} setDb={setDb} userId={studentId} showToast={showToast} studentSession={studentSession} />} />

      <Route path="/company/login" element={<CompanyLogin onLogin={setCompanySession} />} />
      <Route path="/company/dashboard" element={requireCompanyAuth(<CompanyDashboard db={db} userId={companyId} session={{ name: companySession?.name || "Company" }} />)} />
      <Route path="/company/internships" element={requireCompanyAuth(<CompanyInternships db={db} setDb={setDb} userId={companyId} />)} />
      <Route path="/company/applicants" element={requireCompanyAuth(<CompanyApplicants db={db} setDb={setDb} userId={companyId} />)} />
      <Route path="/company/messages" element={requireCompanyAuth(<CCompanyMessages db={db} setDb={setDb} userId={companyId} />)} />
      <Route path="/company/notifications" element={requireCompanyAuth(<CompanyNotifications db={db} setDb={setDb} userId={companyId} />)} />
      <Route path="/company/profile" element={requireCompanyAuth(<CompanyProfile companyId={companyId} />)} />
    </Routes>
  );
}

export default App;
