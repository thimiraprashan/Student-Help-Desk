import React, { useEffect, useState } from "react";
import Sidebar from "../../Common/Sidebar";

const CStudentInternships = ({ userId, studentSession }) => {
  const [internships, setInternships] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [applications, setApplications] = useState([]);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [reviews, setReviews] = useState([]);

  const [companyProfile, setCompanyProfile] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);

  const [search, setSearch] = useState("");
  const [field, setField] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/companies")
      .then((res) => res.json())
      .then((data) => setInternships(data.data || []))
      .catch((err) => console.log(err));

    fetch("http://localhost:5000/applications")
      .then((res) => res.json())
      .then((data) => setApplications(data || []))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/cv/${userId}`)
      .then((res) => res.json())
      .then((data) => setStudentProfile(data))
      .catch((err) => console.log(err));
  }, [userId]);

  useEffect(() => {
    if (!selectedCompany) return;

    fetch(
      `http://localhost:5000/company-profile?companyId=${selectedCompany.companyId}`
    )
      .then((res) => res.json())
      .then((data) => setCompanyProfile(data))
      .catch((err) => console.log(err));
  }, [selectedCompany]);

  const handleApply = async (internship) => {
    try {
      if (!userId) {
        alert("Please log in first.");
        return;
      }

      const fetchedProfile =
        studentProfile ||
        (await fetch(`http://localhost:5000/api/cv/${userId}`).then((res) => res.json()));
      const profile =
        fetchedProfile && (fetchedProfile._id || fetchedProfile.userId)
          ? fetchedProfile
          : null;

      const alreadyApplied = applications.find(
        (a) =>
          String(a.studentId) === String(userId) &&
          String(a.internshipId) === String(internship._id)
      );

      if (alreadyApplied) {
        alert("⚠️ Already applied!");
        return;
      }

      const appData = {
        studentId: userId,
        studentName: profile?.name || studentSession?.name || "Student",
        studentEmail: profile?.email || studentSession?.email || "",
        field: profile?.field || "Not provided",
        year: profile?.year || "",
        gpa: profile?.gpa || "",
        cv: profile?.cv || "",
        internshipId: internship._id,
        title: internship.title,
        companyId: internship.companyId || 1,
        companyName: internship.companyName,
        status: "Pending",
        date: new Date().toISOString().split("T")[0]
      };

      const res = await fetch("http://localhost:5000/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit application");
      }

      const savedApp = await res.json();

      setApplications((prev) => [...prev, savedApp]);
      alert("✅ Applied Successfully!");
    } catch (err) {
      console.log(err);
      alert(err.message || "Unable to apply right now.");
    }
  };

  const handleReviewSubmit = () => {
    if (!rating || !feedback) {
      alert("Add rating & feedback");
      return;
    }

    const newReview = {
      name: studentProfile?.name || studentSession?.name || "Anonymous",
      company: selectedCompany.companyName,
      rating,
      comment: feedback,
      date: new Date().toISOString().split("T")[0]
    };

    const oldReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const updated = [...oldReviews, newReview];

    localStorage.setItem("reviews", JSON.stringify(updated));
    setReviews(updated);

    setRating(0);
    setFeedback("");
    setSelectedCompany(null);
  };

  const filteredInternships = internships.filter((i) => {
    const matchSearch =
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      i.location?.toLowerCase().includes(search.toLowerCase());

    const matchField =
      field === "All" || i.field?.toLowerCase() === field.toLowerCase();

    return matchSearch && matchField;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar session={{ name: studentSession?.name || studentProfile?.name || "Student" }} unreadCount={2} />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Internships</h2>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Search internships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="border border-blue-200 p-3 rounded-lg focus:outline-none"
            >
              <option value="All">All Fields</option>
              <option value="IT">IT</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Management">Management</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInternships.map((i) => {
              const applied = applications.find(
                (a) => String(a.studentId) === String(userId) && String(a.internshipId) === String(i._id)
              );

              return (
                <div
                  key={i._id}
                  className="group bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm flex flex-col gap-3 cursor-pointer
                  hover:bg-blue-100 hover:shadow-md hover:scale-[1.02]
                  transition-all duration-300 hover:ring-2 hover:ring-blue-300"
                >
                  <div className="flex justify-between">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                      {i.companyName?.[0]}
                    </div>

                    <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">ACTIVE</span>
                  </div>

                  <h3 className="font-semibold text-sm">{i.title}</h3>
                  <p className="text-sm text-blue-600">{i.companyName}</p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-white border px-2 py-1 rounded">📍 {i.location}</span>
                    <span className="bg-white border px-2 py-1 rounded">⏱ {i.duration}</span>
                    <span className="bg-white border px-2 py-1 rounded">🏷 {i.field}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {i.skills?.map((s, idx) => (
                      <span key={idx} className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded">
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400">📅 Deadline: {i.deadline || "N/A"}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApply(i)}
                      disabled={applied}
                      className={`flex-1 py-1 rounded ${applied ? "bg-gray-400 text-white" : "bg-green-500 text-white"}`}
                    >
                      {applied ? "Applied" : "Apply"}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCompany(i);
                        const data = JSON.parse(localStorage.getItem("reviews")) || [];
                        setReviews(data);
                      }}
                      className="flex-1 border rounded text-sm"
                    >
                      View Company
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedCompany && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-blue-50 w-[500px] rounded-2xl p-6 shadow-xl border border-blue-100">
            <button onClick={() => setSelectedCompany(null)} className="float-right text-blue-500 hover:text-red-500 text-lg">
              ✖
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-xl text-xl font-bold">
                {companyProfile?.name?.[0]}
              </div>

              <div>
                <h3 className="text-lg font-bold">{companyProfile?.name}</h3>
                <p className="text-sm text-gray-500">{companyProfile?.email}</p>
              </div>
            </div>

            <div className="bg-blue-100 p-4 rounded-xl mb-4 text-sm border border-blue-200">
              <p>📞 {companyProfile?.phone}</p>
              <p>📍 {companyProfile?.location}</p>
              <p>🎯 {companyProfile?.purpose}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Company Details</h4>
              <div className="overflow-hidden rounded-xl border border-blue-100 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-blue-50 text-blue-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Title</th>
                      <th className="px-3 py-2 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(companyProfile?.details || []).length > 0 ? (
                      companyProfile.details.map((detail, index) => (
                        <tr key={`${detail.title}-${index}`} className="border-t border-blue-100">
                          <td className="px-3 py-2 font-medium text-gray-700">{detail.title}</td>
                          <td className="px-3 py-2 text-gray-600">{detail.value}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-3 py-4 text-center text-gray-400">
                          No company details available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <h4 className="font-semibold mb-2">Active Internships</h4>
            {internships
              .filter((x) => x.companyName === selectedCompany.companyName)
              .map((x) => (
                <div key={x._id} className="border border-blue-100 bg-white p-2 rounded mb-2 text-sm hover:bg-blue-50 transition">
                  {x.title} • {x.duration}
                </div>
              ))}

            <h4 className="mt-4 font-semibold">Leave Review</h4>
            <div className="flex gap-1 my-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  className={`cursor-pointer text-xl ${n <= rating ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-blue-200 p-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Write feedback..."
            />

            <button onClick={handleReviewSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CStudentInternships;
