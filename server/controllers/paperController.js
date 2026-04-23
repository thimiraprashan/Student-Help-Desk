import fs from "fs/promises";
import Paper from "../models/Paper.js";

const toPaperPayload = (body, file, existingPaper = null) => {
  const payload = {
    title: body.title,
    faculty: body.faculty,
    moduleCode: body.moduleCode || "",
    moduleName: body.moduleName || "",
    year: Number(body.year),
    semester: body.semester || "Other",
    examType: body.examType || "Final",
    description: body.description || "",
  };

  if (file) {
    payload.fileUrl = file.path.replaceAll("\\", "/");
    payload.fileName = file.originalname;
    payload.fileMimeType = file.mimetype;
  } else if (existingPaper) {
    payload.fileUrl = existingPaper.fileUrl;
    payload.fileName = existingPaper.fileName;
    payload.fileMimeType = existingPaper.fileMimeType;
  }

  return payload;
};

const removeUploadedFile = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    await fs.unlink(fileUrl);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.log("Paper file delete warning:", err.message);
    }
  }
};

export const createPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a past paper file." });
    }

    const paper = await Paper.create(toPaperPayload(req.body, req.file));
    res.status(201).json(paper);
  } catch (err) {
    if (req.file?.path) await removeUploadedFile(req.file.path);
    res.status(500).json({ error: err.message });
  }
};

export const getPapers = async (req, res) => {
  try {
    const { faculty, year, examType, search } = req.query;
    const filter = {};

    if (faculty) filter.faculty = faculty;
    if (year) filter.year = Number(year);
    if (examType) filter.examType = examType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { moduleCode: { $regex: search, $options: "i" } },
        { moduleName: { $regex: search, $options: "i" } },
      ];
    }

    const papers = await Paper.find(filter).sort({ year: -1, createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePaper = async (req, res) => {
  try {
    const existingPaper = await Paper.findById(req.params.id);
    if (!existingPaper) {
      if (req.file?.path) await removeUploadedFile(req.file.path);
      return res.status(404).json({ error: "Past paper not found." });
    }

    const payload = toPaperPayload(req.body, req.file, existingPaper);
    const updatedPaper = await Paper.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (req.file && existingPaper.fileUrl !== req.file.path) {
      await removeUploadedFile(existingPaper.fileUrl);
    }

    res.json(updatedPaper);
  } catch (err) {
    if (req.file?.path) await removeUploadedFile(req.file.path);
    res.status(500).json({ error: err.message });
  }
};

export const deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) return res.status(404).json({ error: "Past paper not found." });

    await removeUploadedFile(paper.fileUrl);
    res.json({ message: "Past paper deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
