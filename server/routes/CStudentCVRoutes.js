import express from "express";
import {
  createCV,
  getCV,
  updateCV,
  deleteCV
} from "../Controllers/CStudentCVController.js";

const router = express.Router();

// CRUD routes
router.post("/", createCV);           // CREATE
router.get("/:userId", getCV);        // READ
router.put("/:userId", updateCV);     // UPDATE
router.delete("/:userId", deleteCV);  // DELETE

export default router;