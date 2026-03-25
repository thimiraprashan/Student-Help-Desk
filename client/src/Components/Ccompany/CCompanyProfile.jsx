import React, { useState, useEffect } from "react";
import Sidebar from "../Common/SSidebar";

const CompanyProfile = () => {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    purpose: ""
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/company-profile")
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProfile(data);
          setIsEditing(false);
          setIsSaved(true);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const validateField = (name, value) => {
    let error = "";

    if (name === "name" && !value) error = "Company name required";

    if (name === "email") {
      if (!value) error = "Email required";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email";
    }

    if (name === "phone") {
      if (!value) error = "Phone required";
      else if (!/^\d{10}$/.test(value)) error = "Phone must be 10 digits";
    }

    if (name === "location" && !value) error = "Location required";
    if (name === "purpose" && !value) error = "Purpose required";

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validate = () => {
    let newErrors = {};

    if (!profile.name) newErrors.name = "Company name required";

    if (!profile.email) newErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(profile.email))
      newErrors.email = "Invalid email";

    if (!profile.phone) newErrors.phone = "Phone required";
    else if (!/^\d{10}$/.test(profile.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!profile.location) newErrors.location = "Location required";
    if (!profile.purpose) newErrors.purpose = "Purpose required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validate()) return;

    const res = await fetch("http://localhost:5000/company-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });

    const data = await res.json();
    setProfile(data);
    window.dispatchEvent(new Event("profileUpdated"));

    alert("Profile Saved!");
    setIsEditing(false);
    setIsSaved(true);
  };

  const updateProfile = async () => {
    if (!validate()) return;

    const res = await fetch(
      `http://localhost:5000/company-profile/${profile._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      }
    );

    const data = await res.json();
    setProfile(data);
    window.dispatchEvent(new Event("profileUpdated"));

    alert("Profile Updated!");
    setIsEditing(false);
  };

  const deleteProfile = async () => {
    await fetch(
      `http://localhost:5000/company-profile/${profile._id}`,
      { method: "DELETE" }
    );

    setProfile({
      name: "",
      email: "",
      phone: "",
      location: "",
      purpose: ""
    });

    setIsEditing(true);
    setIsSaved(false);
    window.dispatchEvent(new Event("profileUpdated"));

    alert("Deleted!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar
        session={{ name: profile.name || "Company" }}
        unreadCount={1}
        role="company"
      />

      <div className="flex-1 p-6">

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT FORM */}
          <div className="bg-white p-6 rounded-2xl shadow border border-blue-200 space-y-4">

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Company Profile
            </h2>

            {/* INPUTS */}
            {["name","email","phone","location"].map((field, i) => (
              <div key={i}>
                <label className="text-blue-600 font-medium capitalize">
                  {field}
                </label>

                <input
                  className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                    errors[field] ? "border-red-400" : "border-blue-300"
                  } bg-white focus:ring-2 focus:ring-blue-200 outline-none`}
                  disabled={!isEditing}
                  value={profile[field]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setProfile({ ...profile, [field]: value });
                    validateField(field, value);
                  }}
                />

                {errors[field] && (
                  <p className="text-red-500 text-xs">{errors[field]}</p>
                )}
              </div>
            ))}

            <div>
              <label className="text-blue-600 font-medium">Purpose</label>

              <textarea
                className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                  errors.purpose ? "border-red-400" : "border-blue-300"
                } bg-white focus:ring-2 focus:ring-blue-200 outline-none`}
                disabled={!isEditing}
                value={profile.purpose}
                onChange={(e) => {
                  const value = e.target.value;
                  setProfile({ ...profile, purpose: value });
                  validateField("purpose", value);
                }}
              />

              {errors.purpose && (
                <p className="text-red-500 text-xs">{errors.purpose}</p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-3">

              {!isSaved && (
                <button
                  onClick={saveProfile}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              )}

              {isSaved && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
              )}

              {isSaved && isEditing && (
                <button
                  onClick={updateProfile}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Update
                </button>
              )}

              <button
                onClick={deleteProfile}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white p-6 rounded-2xl shadow border border-blue-200">

            <h2 className="text-lg font-bold text-gray-800 mb-3">
              About Company
            </h2>

            <p className="text-blue-600 text-sm leading-relaxed">
              This section shows your company purpose and information.
              You can describe your organization, goals, and what kind of
              interns or employees you are looking for.
            </p>

            <div className="mt-4 bg-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">Purpose</p>
              <p className="font-medium text-gray-800">
                {profile.purpose || "No purpose added yet"}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CompanyProfile;