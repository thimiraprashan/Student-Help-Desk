import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

function MainLayout() {
  const location = useLocation();

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      width: "100%",
      overflow: "hidden",
      background: "#0f172a"
    }}>
      <Sidebar />

      <div style={{
        flex: 1,
        padding: "30px",
        overflowY: "auto",
        minHeight: "100vh",
        background: "#0f172a"
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MainLayout;