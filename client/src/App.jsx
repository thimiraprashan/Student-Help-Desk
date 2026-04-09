import React, { useEffect, useState, useContext } from "react";
import { Navigate, Routes, Route, useLocation, useMatch } from "react-router-dom";
import initialDb from "./data";

// old imports
import CSlogin from "./Components/Cstudent/CSlogin";
import CStudentDashboard from "./Components/Cstudent/CStudentDashboard/CStudentDashboardFixed";
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
import CCompanyMessages from "./Components/Ccompany/CCompanyMessagesFixed";
import CompanyProfile from "./Components/Ccompany/CCompanyProfile";
import CompanyLogin from "./Components/Ccompany/CompanyLogin";
import CSregister from "./Components/Cstudent/CSregister";
import {
  getCompanySession,
  getStudentSession,
  setCompanySessionStorage,
  setStudentSessionStorage,
} from "./utils/sessionStore";

// new imports
import Navbar from './components/student/Navbar'
import Home from './pages/student/Home'
import CourseDetails from './pages/student/CourseDetails'
import CoursesList from './pages/student/CoursesList'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import EditCourse from './pages/educator/EditCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Educator from './pages/educator/Educator'
import 'quill/dist/quill.snow.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import Player from './pages/student/Player'
import MyEnrollments from './pages/student/MyEnrollments'
import Loading from './components/student/Loading'

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');
  const [db, setDb] = useState(initialDb);
  const [studentSession, setStudentSession] = useState(() => getStudentSession());
  const [companySession, setCompanySession] = useState(() => getCompanySession());

  const studentId = studentSession?.userId ? Number(studentSession.userId) : null;
  const companyId = companySession?.companyId ? Number(companySession.companyId) : null;

  useEffect(() => {
    if (!studentId) return;

    let isActive = true;

    const syncStudentSession = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cv/${studentId}`);

        if (!res.ok) return;

        const profileData = await res.json();
        if (!isActive || !profileData) return;

        const nextSession = {
          ...studentSession,
          name: profileData.name || studentSession?.name || "Student",
          email: profileData.email || studentSession?.email || "",
        };

        if (
          nextSession.name !== studentSession?.name ||
          nextSession.email !== studentSession?.email
        ) {
          setStudentSessionStorage(nextSession);
          setStudentSession(nextSession);
        }
      } catch (err) {
        console.log(err);
      }
    };

    syncStudentSession();

    return () => {
      isActive = false;
    };
  }, [studentId, studentSession?.name, studentSession?.email]);

  useEffect(() => {
    if (!companyId) return;

    let isActive = true;

    const syncCompanySession = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/company-profile?companyId=${companyId}`
        );

        if (!res.ok) return;

        const profileData = await res.json();
        if (!isActive || !profileData) return;

        const nextSession = {
          ...companySession,
          name: profileData.name || companySession?.name || "Company",
          email: profileData.email || companySession?.email || "",
        };

        if (
          nextSession.name !== companySession?.name ||
          nextSession.email !== companySession?.email
        ) {
          setCompanySessionStorage(nextSession);
          setCompanySession(nextSession);
        }
      } catch (err) {
        console.log(err);
      }
    };

    syncCompanySession();

    return () => {
      isActive = false;
    };
  }, [companyId, companySession]);

  const showToast = (msg) => alert(msg);

  const requireStudentAuth = (element) =>
    studentSession ? element : <Navigate to="/login" replace />;

  const requireCompanyAuth = (element) =>
    companySession ? element : <Navigate to="/company/login" replace />;

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {/* Navbar checks */}
      {!isEducatorRoute && <Navbar />}
      
      <Routes>
        {/* NEW APP ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path='/educator' element={<Educator />}>
          <Route path='/educator' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='edit-course/:id' element={<EditCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StudentsEnrolled />} />
        </Route>

        {/* OLD APP ROUTES */}
        <Route path="/login" element={<CSlogin onLogin={setStudentSession} />} />
        <Route path="/industry-placement" element={<CSlogin onLogin={setStudentSession} />} />
        <Route path="/extra-curricular" element={<CSlogin onLogin={setStudentSession} />} />
        <Route path="/student/dashboard" element={requireStudentAuth(<CStudentDashboard userId={studentId} studentSession={studentSession} />)} />
        <Route path="/student/internships" element={requireStudentAuth(<CStudentInternships db={db} setDb={setDb} userId={studentId} studentSession={studentSession} />)} />
        <Route path="/student/applications" element={requireStudentAuth(<CStudentApplications db={db} userId={studentId} studentSession={studentSession} />)} />
        <Route path="/student/cv" element={requireStudentAuth(<StudentCV userId={studentId} onStudentProfileChange={setStudentSession} studentSession={studentSession} />)} />
        <Route path="/student/guidance" element={requireStudentAuth(<Csguidence userId={studentId} studentSession={studentSession} />)} />
        <Route path="/student/feedback" element={requireStudentAuth(<Csguidence userId={studentId} studentSession={studentSession} />)} />
        <Route path="/student/messages" element={requireStudentAuth(<CCStudentMessages db={db} setDb={setDb} userId={studentId} studentSession={studentSession} />)} />
        <Route path="/student/notifications" element={requireStudentAuth(<CStudentNotifications db={db} setDb={setDb} userId={studentId} showToast={showToast} studentSession={studentSession} />)} />
        <Route path="/company/login" element={<CompanyLogin onLogin={setCompanySession} />} />
        <Route path="/company/dashboard" element={requireCompanyAuth(<CompanyDashboard db={db} userId={companyId} session={{ name: companySession?.name || "Company" }} />)} />
        <Route path="/company/internships" element={requireCompanyAuth(<CompanyInternships db={db} setDb={setDb} userId={companyId} />)} />
        <Route path="/company/applicants" element={requireCompanyAuth(<CompanyApplicants db={db} setDb={setDb} userId={companyId} />)} />
        <Route path="/company/messages" element={requireCompanyAuth(<CCompanyMessages db={db} setDb={setDb} userId={companyId} />)} />
        <Route path="/company/notifications" element={requireCompanyAuth(<CompanyNotifications db={db} setDb={setDb} userId={companyId} />)} />
        <Route path="/company/profile" element={requireCompanyAuth(<CompanyProfile companyId={companyId} onSessionChange={setCompanySession} />)} />
        <Route path="/student/register" element={<CSregister onRegister={setStudentSession} />} />
      </Routes>
    </div>
  )
}

export default App;