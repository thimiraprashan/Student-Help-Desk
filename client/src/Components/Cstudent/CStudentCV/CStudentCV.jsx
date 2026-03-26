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
    cv: null,
    userId: 1
  });

  const [isEditing, setIsEditing] = useState(true);

  // ✅ NEW VALIDATION STATE
  const [errors, setErrors] = useState({});

  const fileRef = useRef();
  const userId = 1;

  // 🔥 READ (NO CHANGE)
  useEffect(() => {
    fetch(`http://localhost:5000/api/cv/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && (data._id || data.userId)) {
          setProfile({
            name: data.name || "",
            email: data.email || "",
            field: data.field || "",
            year: data.year || "",
            phone: data.phone || "",
            gpa: data.gpa || "",
            bio: data.bio || "",
            cvName: data.cvName || "",
            cv: data.cv || null,
            _id: data._id,
            userId: data.userId || userId
          });

          setIsEditing(false);
        }
      })
      .catch(() => console.log("No data"));
  }, []);

  // ✅ VALIDATION FUNCTION
const validate = () => {
  let newErrors = {};

  if (!profile.name || profile.name.length < 3)
    newErrors.name = "Min 3 characters";

  if (!profile.email || !/\S+@\S+\.\S+/.test(profile.email))
    newErrors.email = "Valid email required";

  if (!profile.phone || profile.phone.length < 10)
    newErrors.phone = "Valid phone required";
  if (!profile.field) newErrors.field = "Field required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // 🔥 FILE UPLOAD + AUTO SAVE FIX
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      const updatedProfile = {
        ...profile,
        cv: data.filePath,
        cvName: data.fileName
      };

      setProfile(updatedProfile);

    } catch (err) {
      console.log("Upload error:", err);
    }
  };

  // 🔥 SAVE
  const saveProfile = async (customData) => {

    if (!validate()) return; // ✅ added

    let finalData = customData || profile;

    if (!finalData.cv) {
      delete finalData.cv;
      delete finalData.cvName;
    }

    const res = await fetch("http://localhost:5000/api/cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(finalData)
    });

    const data = await res.json();

    setProfile(data);
    localStorage.setItem("studentProfile", JSON.stringify(data));
    setIsEditing(false);
    alert("Saved!");
  };

  // 🔥 UPDATE
  const updateProfile = async () => {

    if (!validate()) return; // ✅ added

    let bodyData = {
      ...profile,
      userId: Number(userId)
    };

    if (!profile.cv) {
      delete bodyData.cv;
      delete bodyData.cvName;
    }

    const res = await fetch(`http://localhost:5000/api/cv/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    });

    const data = await res.json();

    setProfile(data);
    alert("Updated!");
    setIsEditing(false);
  };

  // 🔥 DELETE (NO CHANGE)
  const deleteProfile = async () => {
    await fetch(`http://localhost:5000/api/cv/${userId}`, {
      method: "DELETE"
    });

    setProfile({
      name: "",
      email: "",
      field: "",
      year: "",
      phone: "",
      gpa: "",
      bio: "",
      cvName: "",
      cv: null,
      userId: userId
    });

    setIsEditing(true);
    alert("Deleted!");
  };

  return (
    <div className="flex min-h-screen bg-white"> {/* ✅ white bg */}

      <Sidebar session={{ name: profile.name }} unreadCount={2} />

      <div className="flex-1 p-6 overflow-auto">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Profile & CV
        </h2>

        {/* ✅ SMALL WIDTH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">

          {/* CV */}
          <div className="group bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] transition">

            <h3 className="font-semibold text-gray-800 mb-4">
              📄 CV / Resume
            </h3>

            {profile.cvName ? (
              <>
                <div className="flex items-center gap-3 bg-white border border-blue-100 p-3 rounded-lg mb-3">
                  <div className="w-10 h-10 bg-red-100 flex items-center justify-center rounded">
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
                  {profile.cv && (
                    <a
                      href={`http://localhost:5000/${profile.cv}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Download
                    </a>
                  )}

                  {isEditing && (
                    <>
                      <button
                        onClick={() => fileRef.current.click()}
                        className="border px-3 py-1 rounded-lg text-sm"
                      >
                        Replace
                      </button>

                      <button
                        onClick={deleteProfile}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-blue-200 rounded-xl h-40 flex flex-col justify-center items-center cursor-pointer hover:bg-blue-100 transition"
              >
                <div className="text-4xl text-green-500 mb-2">📤</div>
                <p className="font-semibold text-gray-700">
                  Click to Upload CV
                </p>
                <small className="text-gray-500">
                  PDF or DOCX • Max 5MB
                </small>
              </div>
            )}

            <input ref={fileRef} type="file" hidden onChange={handleFile} />

          </div>

          {/* PROFILE */}
          <div className="group bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] transition">

            <h3 className="font-semibold text-gray-800 mb-4">
              👤 Profile Details
            </h3>
{["name","email","field","year","phone","gpa"].map((field) => (
  <div key={field}>
    <label className="text-sm text-gray-600 capitalize">{field}</label>

    {/* 🔥 FIELD DROPDOWN */}
    {field === "field" ? (
      <select
        className={`w-full mb-2 p-2 text-sm border rounded bg-white focus:ring-2 
  ${errors[field] ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"}`}
        disabled={!isEditing}
        value={profile.field}
        onChange={(e) => {
          const value = e.target.value;
          setProfile({ ...profile, field: value });
        }}
      >
        <option value="">Select Field</option>
        <option value="IT">IT</option>
        <option value="Engineering">Engineering</option>
        <option value="Business">Business</option>
        <option value="Design">Design</option>
      </select>

    /* 🔥 YEAR SELECT */
    ) : field === "year" ? (
      <select
        className="w-full mb-2 p-2 text-sm border rounded bg-white focus:ring-2 focus:ring-blue-300"
        disabled={!isEditing}
        value={profile.year}
        onChange={(e) => {
          const value = e.target.value;
          setProfile({ ...profile, year: value });
        }}
      >
        {/* <option value="">Select Year</option> */}
        <option value="1">Year 1</option>
        <option value="2">Year 2</option>
        <option value="3">Year 3</option>
        <option value="4">Year 4</option>
      </select>

    /* 🔥 GPA INPUT */
    ) : field === "gpa" ? (
    <input
  type="number"
  min="0"
  max="4"
  step="0.1"
  className="w-full mb-2 p-2 text-sm border rounded bg-white focus:ring-2 focus:ring-blue-300"
  disabled={!isEditing}
  value={profile.gpa}
  onChange={(e) => {
    let value = e.target.value;

    // allow empty (user typing)
    if (value === "") {
      setProfile({ ...profile, gpa: value });
      return;
    }

    // convert to number
    let num = parseFloat(value);

    // ❌ block invalid values
    if (num < 0 || num > 4) return;

    setProfile({ ...profile, gpa: value });
  }}
/>

    /* 🔥 NORMAL INPUTS */
) : (
  <input
    className={`w-full mb-2 p-2 text-sm border rounded bg-white focus:ring-2 
      ${errors[field] ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"}`}
    disabled={!isEditing}
    value={profile[field]}
    onChange={(e) => {
      const value = e.target.value;

      setProfile({ ...profile, [field]: value });

      // 🔥 REAL-TIME VALIDATION
      let error = "";

      if (field === "name") {
        if (!value || value.length < 3)
          error = "Min 3 characters";
      }

      if (field === "email") {
        if (!/\S+@\S+\.\S+/.test(value))
          error = "Valid email required";
      }

      if (field === "phone") {
        if (!/^[0-9]{10,}$/.test(value))
          error = "Valid phone required";
      }

      setErrors({ ...errors, [field]: error });
    }}
  />
)}

    {/* 🔥 ERROR SHOW */}
    {errors[field] && (
      <p className="text-red-500 text-xs">{errors[field]}</p>
    )}
  </div>
))}

            <label>Bio</label>
            <textarea
  className="w-full mb-3 p-2 border rounded bg-white focus:ring-2 focus:ring-blue-300"
  value={profile.bio}
  onChange={(e) =>
    setProfile({ ...profile, bio: e.target.value })
  }
/>

            <div className="flex gap-2">

              {isEditing ? (
                profile._id ? (
                  <button
                    onClick={updateProfile}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Update
                  </button>
                ) : 
                (
                  <button
                    onClick={() => saveProfile()}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save Profile
                  </button>
                )
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              )}

              <button
                onClick={deleteProfile}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentCV;