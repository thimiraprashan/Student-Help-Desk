import express from "express";
import StudentAuth from "../Model/CStudentAuthModel.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existing = await StudentAuth.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Student account already exists" });
    }

    const lastStudent = await StudentAuth.findOne().sort({ studentId: -1 });
    const studentId = lastStudent ? lastStudent.studentId + 1 : 1;

    const student = await StudentAuth.create({
      studentId,
      name,
      email,
      password,
    });

    res.status(201).json({
      userId: student.studentId,
      studentId: student.studentId,
      name: student.name,
      email: student.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const student = await StudentAuth.findOne({ email, password });
    if (!student) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      userId: student.studentId,
      studentId: student.studentId,
      name: student.name,
      email: student.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
