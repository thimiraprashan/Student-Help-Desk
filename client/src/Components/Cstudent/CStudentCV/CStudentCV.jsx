import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../Common/Sidebar";

const StudentCV = () => {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    field: "",
    year: "",
    phone: "",
    gpa: "",
    bio: "",
    cvName: "",
    cv: null
  });

  const fileRef = useRef();

  // 🔥 LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const saved = localStorage.getItem("studentProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      // default values
      setProfile({
        name: "Sasangi Perera",
        email: "sasangi@gmail.com",
        field: "IT",
        year: 3,
        phone: "",
        gpa: "",
        bio: "",
        cvName: "",
        cv: null
      });
    }
  }, []);

  // 🔥 FILE UPLOAD
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
      alert("Only PDF or DOCX files");
      return;
    }

    const fakePath = "uploads/" + file.name;

    const updated = {
      ...profile,
      cv: fakePath,
      cvName: file.name
    };

    setProfile(updated);
    localStorage.setItem("studentProfile", JSON.stringify(updated));

    alert("CV uploaded!");
  };

  // 🔥 SAVE PROFILE
  const saveProfile = () => {
    localStorage.setItem("studentProfile", JSON.stringify(profile));
    alert("Profile updated!");
  };

  // 🔥 REMOVE CV
  const removeCV = () => {
    const updated = {
      ...profile,
      cv: null,
      cvName: ""
    };

    setProfile(updated);
    localStorage.setItem("studentProfile", JSON.stringify(updated));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar session={{ name: profile.name }} unreadCount={2} />

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Profile & CV
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ================= CV SECTION ================= */}
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl shadow-sm">

            <h3 className="font-semibold text-gray-800 mb-4">
              📄 CV / Resume
            </h3>

            {profile.cvName ? (
              <>
                <div className="flex items-center gap-3 bg-white border border-blue-100 p-3 rounded-lg mb-3">
                  <div className="w-10 h-10 bg-red-100 text-red-500 flex items-center justify-center rounded">
                    📄
                  </div>

                  <div>
                    <div className="font-semibold text-gray-700 text-sm">
                      {profile.cvName}
                    </div>
                    <div className="text-xs text-green-500">
                      ✓ Uploaded
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => fileRef.current.click()}
                    className="border px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
                  >
                    Replace
                  </button>

                  <button
                    onClick={removeCV}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-blue-200 rounded-xl h-52 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-blue-100 transition"
              >
                <div className="text-3xl mb-2">📤</div>
                <p className="font-semibold text-gray-700">
                  Click to Upload CV
                </p>
                <small className="text-gray-500">
                  PDF or DOCX • Max 5MB
                </small>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              hidden
              onChange={handleFile}
            />

            <div className="mt-4 bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-sm text-indigo-600">
              💡 Companies can view and download your CV when you apply.
            </div>

          </div>

          {/* ================= PROFILE SECTION ================= */}
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl shadow-sm">

            <h3 className="font-semibold text-gray-800 mb-4">
              👤 Profile Details
            </h3>

            {/* Editable Fields */}
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              className="w-full px-3 py-2 border border-blue-100 rounded-lg mb-3"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />

            <label className="text-sm text-gray-600">Email</label>
            <input
              className="w-full px-3 py-2 border border-blue-100 rounded-lg mb-3"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <label className="text-sm text-gray-600">Field</label>
            <input
              className="w-full px-3 py-2 border border-blue-100 rounded-lg mb-3"
              value={profile.field}
              onChange={(e) =>
                setProfile({ ...profile, field: e.target.value })
              }
            />

            <label className="text-sm text-gray-600">Year</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-blue-100 rounded-lg mb-3"
              value={profile.year}
              onChange={(e) =>
                setProfile({ ...profile, year: e.target.value })
              }
            />

            <label className="text-sm text-gray-600">Phone</label>
            <input
              className="w-full px-3 py-2 border border-blue-100 rounded-lg mb-3"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />

            <label className="text-sm text-gray-600">GPA</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-blue-100 rounded-lg mb-3"
              value={profile.gpa}
              onChange={(e) =>
                setProfile({ ...profile, gpa: e.target.value })
              }
            />

            <label className="text-sm text-gray-600">Bio</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-blue-100 rounded-lg mb-3"
              value={profile.bio}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
            />

            <button
              onClick={saveProfile}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Save Profile
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentCV;