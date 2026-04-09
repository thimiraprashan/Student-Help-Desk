const initialDb = {
  notifications: [
    {
      id: 1,
      toUserId: 1,
      message: "New internship opportunity available!",
      date: "2026-03-20",
      read: false,
    }
  ],
  messages: [],
  students: [
    {
      id: 1,
      name: "Sasangi Perera",
      email: "sasangi@gmail.com",
      field: "IT",
      year: 3,
      gpa: 3.8
    }
  ],
  companies: [
    {
      id: 101,
      name: "Tech Corp",
      email: "techcorp@gmail.com"
    }
  ],
  internships: [
    {
      id: 1,
      title: "Software Engineer Intern",
      companyId: 101,
      location: "Colombo",
      duration: "3 months",
      skills: ["React", "Node.js"],
      approved: true
    }
  ],
  applications: [
    {
      id: 1,
      studentId: 1,
      internshipId: 1,
      status: "Pending"
    }
  ],
  feedbacks: [],
};

export default initialDb;