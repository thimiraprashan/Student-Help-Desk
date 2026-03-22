import React, { useState } from "react";
import Sidebar from "../../Common/Sidebar";
import "./CSguidence.css";

const Csguidence = () => {

  const [result, setResult] = useState(null);

  const QUIZ_DATA = {
    questions: [
      { id: 1, text: "Do you enjoy coding and solving technical problems?", cat: "Software Engineering" },
      { id: 2, text: "Do you like creating visual designs and layouts?", cat: "UI/UX Design" },
      { id: 3, text: "Do you like leading teams and planning tasks?", cat: "Project Management" },
      { id: 4, text: "Do you enjoy analyzing data and statistics?", cat: "Data Science" }
    ],
    roadmaps: {
      "Software Engineering": ["Programming Logic", "JavaScript Frameworks", "Database", "Cloud"],
      "UI/UX Design": ["Design Principles", "Figma", "User Research", "Prototyping"],
      "Project Management": ["Agile", "Planning", "Risk", "Communication"],
      "Data Science": ["Statistics", "Python", "ML", "Visualization"]
    }
  };

  return (
    <div className="layout">

      {/* Sidebar */}
      <Sidebar session={{ name: "Sasangi Perera" }} unreadCount={2} />

      {/* Page */}
      <div className="page">

        {/* 🎯 Quiz Section */}
        <div className="card">

          <h3 className="title">
            🎯 Career Path Discovery
          </h3>

          {!result ? (
            <>
              <p className="subtitle">
                Select your interest:
              </p>

              <div className="quiz-grid">
                {QUIZ_DATA.questions.map(q => (
                  <div
                    key={q.id}
                    className="quiz-item"
                    onClick={() => setResult(q.cat)}
                  >
                    {q.text}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="result">

              <span className="badge">Your Best Match</span>
              <h2>{result}</h2>

              <div className="roadmap">
                <p className="roadmap-title">Recommended Roadmap</p>

                {QUIZ_DATA.roadmaps[result].map((step, i) => (
                  <div key={i} className="step">
                    <div className="circle">{i + 1}</div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <button className="back" onClick={() => setResult(null)}>
                ← Back
              </button>

            </div>
          )}

        </div>

        {/* 💬 Feedback */}
        <h2 className="feedback-title">Career Feedback</h2>

        <div className="feedback-box">
          <p>No feedback submitted yet.</p>
        </div>

      </div>
    </div>
  );
};

export default Csguidence;