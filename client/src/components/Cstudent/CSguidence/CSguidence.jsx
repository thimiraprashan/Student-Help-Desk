import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar";

const Csguidence = ({ studentSession }) => {
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

  const careerPaths = [
    {
      id: 1,
      title: "Software Development",
      description: "I like coding, building apps, and solving technical problems.",
      recommendation:
        "You may enjoy frontend, backend, full-stack, or mobile app development internships.",
      roles: ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
      roadmap: ["Programming Logic", "JavaScript or Java", "Databases", "Cloud Basics"]
    },
    {
      id: 2,
      title: "UI/UX Design",
      description: "I like designing screens, layouts, and user-friendly interfaces.",
      recommendation:
        "You may enjoy UI design, UX research, product design, or web design internships.",
      roles: ["UI Designer", "UX Researcher", "Product Designer"],
      roadmap: ["Design Principles", "Figma", "User Research", "Prototyping"]
    },
    {
      id: 3,
      title: "Project Management",
      description: "I like leading teams, planning tasks, and organizing work.",
      recommendation:
        "You may enjoy project coordination, scrum, product ownership, or operations internships.",
      roles: ["Project Coordinator", "Scrum Assistant", "Product Assistant"],
      roadmap: ["Agile Basics", "Planning", "Risk Management", "Communication"]
    },
    {
      id: 4,
      title: "Data Analysis",
      description: "I like working with data, charts, statistics, and reports.",
      recommendation:
        "You may enjoy data analyst, business analyst, or reporting internships.",
      roles: ["Data Analyst", "Business Analyst", "Reporting Assistant"],
      roadmap: ["Statistics", "Excel or SQL", "Python Basics", "Data Visualization"]
    }
  ];

  const selectedCareer = careerPaths.find((path) => path.title === result);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        session={{ name: studentSession?.name || "Student" }}
        unreadCount={2}
      />

      <div className="flex-1 p-6">
        <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Find Your Best Career Path
          </h3>

          <p className="mb-5 text-gray-500">
            Choose the career area that matches your interests. The system will
            show a recommended path and skills to improve.
          </p>

          {!selectedCareer ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {careerPaths.map((path) => (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => setResult(path.title)}
                  className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-left transition hover:-translate-y-1 hover:bg-blue-100 hover:shadow-md"
                >
                  <h4 className="font-semibold text-gray-800">{path.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {path.description}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                Your Best Match
              </span>

              <h2 className="mt-3 text-2xl font-bold text-gray-800">
                Recommended Career Path: {selectedCareer.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {selectedCareer.recommendation}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedCareer.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                  >
                    {role}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <p className="mb-4 text-sm font-semibold text-blue-700">
                  Skills to focus on
                </p>

                {selectedCareer.roadmap.map((step, i) => (
                  <div key={step} className="mb-3 flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-sm text-white">
                      {i + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setResult(null)}
                className="mt-4 rounded-lg border px-4 py-2 hover:bg-gray-100"
              >
                Choose another path
              </button>
            </div>
          )}
        </div>

        <h2 className="mb-3 mt-8 text-lg font-semibold text-gray-800">
          Career Feedback
        </h2>

        <div
          className={`rounded-xl border bg-white p-6 transition ${
            error ? "border-red-400 ring-2 ring-red-200" : "border-blue-100"
          }`}
        >
          {allReviews.length === 0 ? (
            <p className="text-center font-semibold text-red-500">
              No feedback submitted yet!
            </p>
          ) : (
            allReviews.map((review, i) => (
              <div
                key={`${review.company}-${review.date}-${i}`}
                className={`mb-3 rounded-lg bg-blue-50 p-4 transition hover:scale-[1.01] hover:bg-blue-100 hover:shadow-md ${
                  error ? "border border-red-300" : "border border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.name}</p>

                  <div className="flex items-center gap-3">
                    <div className="text-2xl text-yellow-400">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(i)}
                      className="rounded border px-2 py-1 text-xs text-red-500 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="text-sm text-blue-600">{review.company}</p>
                <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                <p className="mt-1 text-xs text-gray-400">{review.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Csguidence;