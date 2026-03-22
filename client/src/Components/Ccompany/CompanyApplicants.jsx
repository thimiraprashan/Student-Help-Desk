import React from "react";
import Sidebar from "../Common/Sidebar";

const CompanyApplicants = ({ db, userId }) => {

  const myInternships = db.internships.filter(
    (i) => i.companyId === userId
  );

  const myApplications = db.applications.filter((a) =>
    myInternships.some((i) => i.id === a.internshipId)
  );

  return (
    <div style={{ display: "flex" }}>

      <Sidebar session={{ name: "TechCorp Lanka" }} unreadCount={1} />

      <div style={{ flex: 1, padding: 30, color: "white" }}>
        <h2>Applicants</h2>

        {myApplications.length === 0 && (
          <p>No applicants yet</p>
        )}

        {myApplications.map((app) => {
          const student = db.students.find(
            (s) => s.id === app.studentId
          );

          const internship = db.internships.find(
            (i) => i.id === app.internshipId
          );

          return (
            <div
              key={app.id}
              style={{
                background: "#1e293b",
                padding: 20,
                borderRadius: 12,
                marginTop: 15,
              }}
            >
              <h3>{student?.name}</h3>
              <p>{internship?.title}</p>
              <p>Status: {app.status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyApplicants;