import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

function Sidebar() {
  return (
    <div style={sidebarStyle}>
      <h2 style={{ marginBottom: "40px", fontSize: "1.8rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
        <span>🏛️</span> SLIIT Help
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 1 }}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <NavLink
            to="/help"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-3xl transition-all duration-300 transform ${
                isActive
                  ? "bg-white/10 border-l-4 border-cyan-300 shadow-lg"
                  : "hover:bg-white/15 hover:-translate-x-1"
              }`
            }
          >
            <span>📊</span> Dashboard
          </NavLink>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <NavLink
            to="/help/ai"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-3xl transition-all duration-300 transform ${
                isActive
                  ? "bg-white/10 border-l-4 border-cyan-300 shadow-lg"
                  : "hover:bg-white/15 hover:-translate-x-1"
              }`
            }
          >
            <span>🧠</span> Learn with AI
          </NavLink>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <NavLink
            to="/help/study"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-3xl transition-all duration-300 transform ${
                isActive
                  ? "bg-white/10 border-l-4 border-cyan-300 shadow-lg"
                  : "hover:bg-white/15 hover:-translate-x-1"
              }`
            }
          >
            <span>📘</span> Study Guide
          </NavLink>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <NavLink
            to="/help/papers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-3xl transition-all duration-300 transform ${
                isActive
                  ? "bg-white/10 border-l-4 border-cyan-300 shadow-lg"
                  : "hover:bg-white/15 hover:-translate-x-1"
              }`
            }
          >
            <span>📄</span> Past Papers
          </NavLink>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <NavLink
            to="/help/contact"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-4 rounded-3xl transition-all duration-300 transform ${
                isActive
                  ? "bg-white/10 border-l-4 border-cyan-300 shadow-lg"
                  : "hover:bg-white/15 hover:-translate-x-1"
              }`
            }
          >
            <span>📞</span> Contact SLIIT
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}

const sidebarStyle = {
  width: "260px",
  height: "100vh",
  background: "linear-gradient(180deg, #111827 0%, #0b1226 100%)",
  padding: "30px 20px",
  color: "white",
  display: "flex",
  flexDirection: "column",
  boxShadow: "2px 0 16px rgba(0, 0, 0, 0.35)",
  position: "relative",
  overflow: "hidden"
};

export default Sidebar;