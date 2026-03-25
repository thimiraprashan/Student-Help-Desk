import express from "express";
const router = express.Router();

import CStudentController from "../Controllers/CStudentControllers.js";

router.get("/", CStudentController.getAllStudents);
router.post("/", CStudentController.addStudent);
router.get("/:id", CStudentController.getById);
router.put("/:id", CStudentController.updateStudent);
router.delete("/:id", CStudentController.deleteStudent);

export default router;