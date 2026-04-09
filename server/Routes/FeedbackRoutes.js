import express from "express";
import Feedback from "../Model/FeedbackModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { studentId, companyId } = req.query;
    const query = {};

    if (studentId) {
      query.studentId = Number(studentId);
    }

    if (companyId) {
      query.companyId = Number(companyId);
    }

    const feedback = await Feedback.find(query).sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { studentId, studentName, company, rating, comment } = req.body;

    if (!studentId || !studentName || !company || !rating || !comment) {
      return res.status(400).json({ error: "All feedback fields are required" });
    }

    const saved = await Feedback.create({
      ...req.body,
      studentId: Number(studentId),
      companyId: req.body.companyId ? Number(req.body.companyId) : null,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
