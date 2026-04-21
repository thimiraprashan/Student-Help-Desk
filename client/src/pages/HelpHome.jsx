import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import aiImage from "../assets/How-long-does-it-take-learn-AI.jpg";
import studyImage from "../assets/Study guid.png";
import pastPapersImage from "../assets/past papers.png";
import contactImage from "../assets/Contact sliit.png";

const cardItems = [
  { title: "Learn with AI", path: "ai", bg: aiImage },
  { title: "Study Guide", path: "study", bg: studyImage },
  { title: "Past Papers", path: "papers", bg: pastPapersImage },
  { title: "Contact SLIIT", path: "contact", bg: contactImage }
];

function HelpHome() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 style={{ color: "#f1f5f9", fontSize: "2.5rem", marginBottom: "12px" }}>Welcome to SLIIT Help Center</h1>

      <p style={{ color: "#cbd5e1", fontSize: "1rem", marginBottom: "30px" }}>Select an option from the sidebar or tap one of the buttons below.</p>

      <div style={{
        marginTop: "45px",
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "20px"
      }}>
        {cardItems.map((card, index) => (
          <motion.div
            key={card.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              title={card.title}
              bg={card.bg}
              onClick={() => navigate(`/help/${card.path}`)}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Card({ title, onClick, bg }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300 cursor-pointer relative"
      style={{
        background: bg
          ? `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.4)), url(${bg}) center/cover no-repeat`
          : "transparent",
        padding: "28px 32px",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        width: "100%",
        minHeight: "170px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#f1f5f9"
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <h3 className="relative z-10 text-white text-xl font-bold" style={{ margin: 0, color: "#f1f5f9", fontWeight: "600" }}>
        {title}
      </h3>
    </motion.button>
  );
}

export default HelpHome;