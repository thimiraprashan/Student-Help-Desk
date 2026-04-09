import express from "express";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("cv"), (req, res) => {
  res.json({
    filePath: req.file.path,
    fileName: req.file.originalname
  });
});

export default router;