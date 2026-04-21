import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

// Pages inside your module
import AiChat from "./pages/AiChat";
import StudyGuide from "./pages/StudyGuide";
import PastPapers from "./pages/PastPapers";
import Contact from "./pages/Contact";

// Entry page (your main page)
import HelpHome from "./pages/HelpHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root to /help */}
        <Route path="/" element={<Navigate to="/help" replace />} />

        {/* YOUR MODULE */}
        <Route path="/help" element={<MainLayout />}>

          {/* Default when user clicks "Help" */}
          <Route index element={<HelpHome />} />

          {/* Sidebar pages */}
          <Route path="ai" element={<AiChat />} />
          <Route path="study" element={<StudyGuide />} />
          <Route path="papers" element={<PastPapers />} />
          <Route path="contact" element={<Contact />} />

        </Route>

        <Route path="*" element={<Navigate to="/help" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;