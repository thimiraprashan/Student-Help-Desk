import React, { useState, useRef } from "react";
import "./CStudentCV.css";
import Sidebar from "../../Common/Sidebar";

const StudentCV = () => {

  const [profile, setProfile] = useState({
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

  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
      alert("Only PDF or DOCX files");
      return;
    }

    const fakePath = "uploads/" + file.name;

    setProfile({
      ...profile,
      cv: fakePath,
      cvName: file.name
    });

    alert("CV uploaded!");
  };

  const saveProfile = () => {
    console.log("Saved:", profile);
    alert("Profile updated!");
  };

  const removeCV = () => {
    setProfile({
      ...profile,
      cv: null,
      cvName: ""
    });
  };

  return (
    <div className="layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="page">

        <h2 className="title">My Profile & CV</h2>

        <div className="grid">

          {/* CV Upload */}
          <div className="card">
            <h3>📄 CV / Resume</h3>

            {profile.cvName ? (
              <>
                <div className="cv-box">
                  <div className="cv-icon">📄</div>
                  <div>
                    <div className="cv-name">{profile.cvName}</div>
                    <div className="cv-success">✓ Uploaded</div>
                  </div>
                </div>

                <div className="btn-group">
                  <button onClick={() => fileRef.current.click()}>
                    Replace
                  </button>
                  <button className="danger" onClick={removeCV}>
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <div
                className="upload-box"
                onClick={() => fileRef.current.click()}
              >
                <div className="upload-icon">📤</div>
                <p>Click to Upload CV</p>
                <small>PDF or DOCX • Max 5MB</small>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              hidden
              onChange={handleFile}
            />

            {/* Hint */}
            <div className="cv-hint">
              💡 Companies can view and download your CV when you apply for internships.
            </div>
          </div>

          {/* Profile */}
          <div className="card">
            <h3>👤 Profile Details</h3>

            <div className="info-box">
              <b>{profile.name}</b>
              <p>{profile.email} · {profile.field} · Year {profile.year}</p>
            </div>

            <label>Phone</label>
            <input
              className="input"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder="07X-XXXXXXX"
            />

            <label>GPA</label>
            <input
              className="input"
              type="number"
              value={profile.gpa}
              onChange={(e) =>
                setProfile({ ...profile, gpa: e.target.value })
              }
              placeholder="3.5"
            />

            <label>Bio (visible to companies)</label>
            <textarea
              className="input"
              rows={3}
              value={profile.bio}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
              placeholder="Tell companies about yourself..."
            />

            <button className="primary" onClick={saveProfile}>
              Save Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentCV;