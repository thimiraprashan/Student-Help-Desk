import Student from "../Model/CStudentModel.js";

// =======================
// Get All Students
// =======================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();

    if (!students) {
      return res.status(404).json({ message: "Students not found" });
    }

    return res.status(200).json({ students });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// Add Student
// =======================
const addStudent = async (req, res) => {
  try {
    const { name, gmail, age } = req.body;

    const student = new Student({
      name,
      gmail,
      age
    });

    await student.save();

    return res.status(201).json({ student });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Unable to add student" });
  }
};

// =======================
// Get Student By ID
// =======================
const getById = async (req, res) => {
  try {
    const id = req.params.id;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ student });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// Update Student
// =======================
const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, gmail, age } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      { name, gmail, age },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Unable to update student" });
    }

    return res.status(200).json({ student });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// Delete Student
// =======================
const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: "Unable to delete student" });
    }

    return res.status(200).json({ message: "Student deleted successfully" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// Export (ES Module)
// =======================
export default {
  getAllStudents,
  addStudent,
  getById,
  updateStudent,
  deleteStudent
};