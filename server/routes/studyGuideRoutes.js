import express from "express";
import {
  addStudyMaterial,
  getStudyMaterials,
  updateStudyMaterial,
  deleteStudyMaterial
} from "../controllers/studyGuideController.js";

const router = express.Router();

router.post("/", addStudyMaterial);
router.get("/", getStudyMaterials);
router.put("/:id", updateStudyMaterial);
router.delete("/:id", deleteStudyMaterial);

export default router;
