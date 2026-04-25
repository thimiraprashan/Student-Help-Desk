import React, { useState, useEffect } from "react";
import Sidebar from "../../Common/Sidebar";

const Csguidence = ({ userId, studentSession }) => {

  const [result, setResult] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("reviews")) || [];
    setAllReviews(data);

    if (data.length === 0) setError(true);
  }, []);

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    const updated = allReviews.filter((_, i) => i !== index);
    setAllReviews(updated);
    localStorage.setItem("reviews", JSON.stringify(updated));

    if (updated.length === 0) setError(true);
  };

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

      <Sidebar session={{ name: studentSession?.name || "Student" }} unreadCount={2} />

      <div className="flex-1 p-6">

        {/* QUIZ */}
        <div className="bg-white border border-blue-100 p-6 rounded-xl shadow-sm">

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            🎯 Career Path Discovery
          </h3>

          <p className="text-gray-500 mb-5">
            Select the area that interests you the most:
          </p>

          {!result ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {QUIZ_DATA.questions.map(q => (
                <div
                  key={q.id}
                  onClick={() => setResult(q.cat)}
                  className="bg-blue-50 border border-blue-200 p-4 rounded-xl cursor-pointer hover:bg-blue-100 hover:shadow-md hover:-translate-y-1 transition"
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

              <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl mt-4">
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

        {/* FEEDBACK */}
        <h2 className="mt-8 mb-3 text-lg font-semibold text-gray-800">
          Career Feedback
        </h2>

        <div className={`bg-white border p-6 rounded-xl transition
          ${error ? "border-red-400 ring-2 ring-red-200" : "border-blue-100"}`}>

          {allReviews.length === 0 ? (
            <p className="text-center text-red-500 font-semibold">
              No feedback submitted yet!
            </p>
          ) : (
            allReviews.map((r, i) => (
              <div
                key={i}
                className={`bg-blue-50 p-4 rounded-lg mb-3 border transition
                  ${error ? "border-red-300" : "border-blue-200"}
                  hover:bg-blue-100 hover:shadow-md hover:scale-[1.01]`}
              >

                <div className="flex justify-between items-center">
                  <p className="font-semibold">{r.name}</p>

                  <div className="flex items-center gap-3">

                    <div className="text-yellow-400 text-2xl">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </div>

                    <button
                      onClick={() => handleDelete(i)}
                      className="text-red-500 text-xs border px-2 py-1 rounded hover:bg-red-100"
                    >
                      Delete
                    </button>

                  </div>
                </div>

                <p className="text-sm text-blue-600">{r.company}</p>
                <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-1">{r.date}</p>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default Csguidence;