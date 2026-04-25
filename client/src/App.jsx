import React, { useEffect, useState } from "react";
import { Navigate, Routes, Route, useMatch } from "react-router-dom";
import initialDb from "./data";
import AdminDashboard from "./pages/AdminDashboard";


// ── Student imports ──────────────────────────────────────────────
import CSlogin from "./components/Cstudent/CSlogin";
import CStudentDashboard from "./components/Cstudent/CStudentDashboard/CStudentDashboardFixed";
import CStudentInternships from "./components/Cstudent/CStudentInternships/CStudentInternships";
import CStudentApplications from "./components/Cstudent/CStudentApplications/CStudentApplications";
import StudentCV from "./components/Cstudent/CStudentCV/CStudentCV";
import Csguidence from "./components/Cstudent/CSguidence/CSguidence";
import CStudentNotifications from "./components/Cstudent/CStudentNotifications/CStudentNotifications";
import CCStudentMessages from "./components/Cstudent/CStudentMessages/CCStudentMessages";
import CSregister from "./components/Cstudent/CSregister";

// ── Company imports ──────────────────────────────────────────────
import CompanyDashboard from "./components/Ccompany/CompanyDashboard";
import CompanyInternships from "./components/Ccompany/CompanyInternships";
import CompanyApplicants from "./components/Ccompany/CompanyApplicants";
import CompanyFeedback from "./components/Ccompany/CompanyFeedback";
import CCompanyMessages from "./components/Ccompany/CCompanyMessagesFixed";
import CompanyProfile from "./components/Ccompany/CCompanyProfile";
import CompanyLogin from "./components/Ccompany/CompanyLogin";

// ── Session utils ────────────────────────────────────────────────
import {
  getCompanySession,
  getStudentSession,
  setCompanySessionStorage,
  setStudentSessionStorage,
} from "./utils/sessionStore";

// ── Extra Curricular imports ─────────────────────────────────────
import Layout from "./components/Layout";
import ExtraCurricularHome from "./pages/Home";
import Events from "./pages/Events";
import Sports from "./pages/Sports";
import Clubs from "./pages/Clubs";
import ActivityNotifications from "./pages/Notifications";


// ── Educator / LMS imports ───────────────────────────────────────
import Navbar from "./components/student/Navbar";
import Home from "./pages/student/Home";
import CourseDetails from "./pages/student/CourseDetails";
import CoursesList from "./pages/student/CoursesList";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import EditCourse from "./pages/educator/EditCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import Educator from "./pages/educator/Educator";
import Player from "./pages/student/Player";
import MyEnrollments from "./pages/student/MyEnrollments";
import Loading from "./components/student/Loading";
import Footer from "./components/educator/Footer";
import "quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// ── Help Desk imports ───────────────────────────────────────────
import HelpHome from "./pages/HelpHome";
import MainLayout from "./layouts/MainLayout";
import AiChat from "./pages/AiChat";
import StudyGuide from "./pages/StudyGuide";
import PastPapers from "./pages/PastPapers";
import Contact from "./pages/Contact";
import BecomeEducator from "./pages/student/BecomeEducator";
import EducatorApplication from "./pages/student/EducatorApplication";
import AdminLogin from "./pages/admin/AdminLogin";
import DeptHeadApproval from "./pages/admin/DeptHeadApproval";

// Wrapper that adds educator Footer flush to the bottom
const WithFooter = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <div style={{ flex: 1 }}>{children}</div>
    <Footer />
  </div>
);



const App = () => {
  const isEducatorRoute = useMatch("/educator/*");
  const [db, setDb] = useState(initialDb);
  const [studentSession, setStudentSession] = useState(() => getStudentSession());
  const [companySession, setCompanySession] = useState(() => getCompanySession());

  const studentId = studentSession?.userId ? Number(studentSession.userId) : null;
  const companyId = companySession?.companyId ? Number(companySession.companyId) : null;

  // Sync student session from CV profile
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
    return () => { isActive = false; };
  }, [studentId, studentSession?.name, studentSession?.email]);

  // Sync company session from profile
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
    return () => { isActive = false; };
  }, [companyId, companySession]);

  const showToast = (msg) => alert(msg);

  const requireStudentAuth = (element) =>
    studentSession ? element : <Navigate to="/login" replace />;

  const requireCompanyAuth = (element) =>
    companySession ? element : <Navigate to="/company/login" replace />;

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />

      {/* Show Navbar on all pages except educator dashboard */}
      {!isEducatorRoute && <Navbar />}

      <Routes>
        {/* ── Educator / LMS Routes ── */}
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/educator" element={<Educator />}>
          <Route path="/educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="edit-course/:id" element={<EditCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        </Route>

        {/* ── Extra Curricular Routes ── */}
        <Route path="/extra-curricular" element={<Layout />}>
          <Route index element={<ExtraCurricularHome />} />
        </Route>
        <Route path="/kuppi-sessions" element={<Navigate to="/course-list" replace />} />
        <Route path="/events" element={<Layout />}>
          <Route index element={<Events />} />
        </Route>
        <Route path="/sports" element={<Layout />}>
          <Route index element={<Sports />} />
        </Route>
        <Route path="/clubs" element={<Layout />}>
          <Route index element={<Clubs />} />
        </Route>
        <Route path="/notifications" element={<Layout />}>
          <Route index element={<ActivityNotifications />} />
        </Route>

        {/* ── Student Routes ── */}
        <Route path="/login" element={<WithFooter><CSlogin onLogin={setStudentSession} /></WithFooter>} />
        <Route path="/industry-placement" element={<WithFooter><CSlogin onLogin={setStudentSession} /></WithFooter>} />
        <Route path="/student/dashboard" element={requireStudentAuth(<WithFooter><CStudentDashboard userId={studentId} studentSession={studentSession} /></WithFooter>)} />
        <Route path="/student/internships" element={requireStudentAuth(<WithFooter><CStudentInternships db={db} setDb={setDb} userId={studentId} studentSession={studentSession} /></WithFooter>)} />
        <Route path="/student/applications" element={requireStudentAuth(<WithFooter><CStudentApplications db={db} userId={studentId} studentSession={studentSession} /></WithFooter>)} />
        <Route path="/student/cv" element={requireStudentAuth(<WithFooter><StudentCV userId={studentId} onStudentProfileChange={setStudentSession} studentSession={studentSession} /></WithFooter>)} />
        <Route path="/student/guidance" element={requireStudentAuth(<WithFooter><Csguidence userId={studentId} studentSession={studentSession} /></WithFooter>)} />
        <Route path="/student/feedback" element={requireStudentAuth(<WithFooter><Csguidence userId={studentId} studentSession={studentSession} /></WithFooter>)} />
        <Route path="/student/messages" element={requireStudentAuth(<WithFooter><CCStudentMessages db={db} setDb={setDb} userId={studentId} studentSession={studentSession} /></WithFooter>)} />
        <Route path="/student/notifications" element={requireStudentAuth(<WithFooter><CStudentNotifications db={db} setDb={setDb} userId={studentId} showToast={showToast} studentSession={studentSession} /></WithFooter>)} />
        <Route path="/student/register" element={<WithFooter><CSregister onRegister={setStudentSession} /></WithFooter>} />

        {/* ── Company Routes ── */}
        <Route path="/company/login" element={<WithFooter><CompanyLogin onLogin={setCompanySession} /></WithFooter>} />
        <Route path="/company/dashboard" element={requireCompanyAuth(<WithFooter><CompanyDashboard db={db} userId={companyId} session={{ name: companySession?.name || "Company" }} /></WithFooter>)} />
        <Route path="/company/internships" element={requireCompanyAuth(<WithFooter><CompanyInternships db={db} setDb={setDb} userId={companyId} /></WithFooter>)} />
        <Route path="/company/applicants" element={requireCompanyAuth(<WithFooter><CompanyApplicants db={db} setDb={setDb} userId={companyId} /></WithFooter>)} />
        <Route path="/company/messages" element={requireCompanyAuth(<WithFooter><CCompanyMessages db={db} setDb={setDb} userId={companyId} /></WithFooter>)} />
        <Route path="/company/feedback" element={requireCompanyAuth(<WithFooter><CompanyFeedback userId={companyId} /></WithFooter>)} />
        <Route path="/company/notifications" element={<Navigate to="/company/feedback" replace />} />
        <Route path="/company/profile" element={requireCompanyAuth(<WithFooter><CompanyProfile companyId={companyId} onSessionChange={setCompanySession} /></WithFooter>)} />

        {/* ── Help Desk Routes ── */}
        <Route path="/help" element={<MainLayout />}>
          <Route index element={<HelpHome />} />
          <Route path="ai" element={<AiChat />} />
          <Route path="study" element={<StudyGuide />} />
          <Route path="papers" element={<PastPapers />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* ── Help Desk Routes ── */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* ── Educator Application & Admin Routes ── */}
        <Route path="/become-educator" element={<BecomeEducator />} />
        <Route path="/educator-apply" element={<EducatorApplication />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dept-head-approval" element={<DeptHeadApproval />} />
      </Routes>
    </div>
  );
};

export default App;
