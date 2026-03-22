import React, { useState } from "react";
import Sidebar from "../../Common/Sidebar";

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
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar session={{ name: "Sasangi Perera" }} unreadCount={2} />

      <div className="flex-1 p-6">

        {/* Card */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl shadow-sm">

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            🎯 Career Path Discovery
          </h3>

          <p className="text-gray-500 mb-5">
            Select the area that interests you the most to see your learning roadmap:
          </p>

          {!result ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {QUIZ_DATA.questions.map(q => (
                <div
                  key={q.id}
                  onClick={() => setResult(q.cat)}
                  className="bg-white border border-blue-100 p-4 rounded-xl cursor-pointer hover:shadow-md hover:-translate-y-1 transition"
                >
                  {q.text}
                </div>
              ))}
            </div>
          ) : (
            <div>

              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
                Your Best Match
              </span>

              <h2 className="text-2xl font-bold mt-3 text-gray-800">
                {result}
              </h2>

              <div className="bg-white border border-blue-100 p-5 rounded-xl mt-4">
                <p className="text-sm text-indigo-600 mb-3 font-semibold">
                  Recommended Roadmap
                </p>

                {QUIZ_DATA.roadmaps[result].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm">
                      {i + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setResult(null)}
                className="mt-4 border px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                ← Back
              </button>

            </div>
          )}
        </div>

        {/* Feedback */}
        <h2 className="mt-8 mb-3 text-lg font-semibold text-gray-800">
          Career Feedback
        </h2>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center text-gray-500">
          No feedback submitted yet.
        </div>

      </div>
    </div>
  );
};

export default Csguidence;