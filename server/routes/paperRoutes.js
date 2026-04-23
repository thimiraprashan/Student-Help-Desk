import express from "express";
import { upload } from "../middleware/upload.js";
import {
  createPaper,
  deletePaper,
  getPapers,
  updatePaper,
} from "../controllers/paperController.js";

const router = express.Router();

router.post("/", upload.single("paper"), createPaper);
router.get("/", getPapers);
router.put("/:id", upload.single("paper"), updatePaper);
router.delete("/:id", deletePaper);

export default router;
