import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

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

function App() {

  const [db, setDb] = useState({

    notifications: [
      {
        id: 1,
        toUserId: 1,
        message: "New internship opportunity available!",
        date: "2026-03-20",
        read: false,
      }
    ],

    messages: [],

    // ✅ FULL STUDENT DATA
    students: [
      {
        id: 1,
        name: "Sasangi Perera",
        email: "sasangi@gmail.com",
        field: "IT",
        year: 3,
        gpa: 3.8
      }
    ],

    // ✅ SAMPLE INTERNSHIP
    internships: [
      {
        id: 1,
        title: "Software Engineer Intern",
        companyId: 1,
        location: "Colombo",
        duration: "3 months",
        skills: ["React", "Node.js"],
        approved: true
      }
    ],

    // ✅ THIS FIXES EMPTY APPLICANTS
    applications: [
      {
        id: 1,
        studentId: 1,
        internshipId: 1,
        status: "pending"
      }
    ],

    feedbacks: [],
  });

  const userId = 1;

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

      <Route
        path="/student/internships"
        element={<CStudentInternships db={db} setDb={setDb} userId={userId} />}
      />

      <Route
        path="/student/applications"
        element={<CStudentApplications db={db} userId={userId} />}
      />

      <Route path="/student/cv" element={<StudentCV />} />

      <Route path="/student/guidance" element={<Csguidence />} />
      <Route path="/student/feedback" element={<Csguidence />} />

      <Route
        path="/student/messages"
        element={
          <CCStudentMessages
            db={db}
            setDb={setDb}
            userId={userId}
            getThread={getThread}
            threadId={threadId}
          />
        }
      />

      <Route
        path="/student/notifications"
        element={
          <CStudentNotifications
            db={db}
            setDb={setDb}
            userId={userId}
            showToast={showToast}
          />
        }
      />

      {/* COMPANY */}
      <Route
        path="/company/dashboard"
        element={
          <CompanyDashboard
            db={db}
            userId={userId}
            session={{ name: "TechCorp Lanka" }}
          />
        }
      />

      <Route
        path="/company/internships"
        element={
          <CompanyInternships
            db={db}
            setDb={setDb}
            userId={userId}
          />
        }
      />

      <Route
        path="/company/applicants"
        element={
          <CompanyApplicants
            db={db}
            setDb={setDb}
            userId={userId}
          />
        }
      />

      <Route
        path="/company/notifications"
        element={
          <CompanyNotifications
            db={db}
            setDb={setDb}
            userId={userId}
          />
        }
      />

    </Routes>
  );
}

export default App;