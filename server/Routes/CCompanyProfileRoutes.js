import express from "express";
import CompanyProfile from "../Model/CCompanyProfileModel.js";

const router = express.Router();

// 🔥 GET profile
router.get("/", async (req, res) => {
  const profile = await CompanyProfile.findOne();
  res.json(profile);
});

// 🔥 CREATE
router.post("/", async (req, res) => {
  const newProfile = new CompanyProfile(req.body);
  const saved = await newProfile.save();
  res.json(saved);
});

// 🔥 UPDATE
router.put("/:id", async (req, res) => {
  const updated = await CompanyProfile.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// 🔥 DELETE
router.delete("/:id", async (req, res) => {
  await CompanyProfile.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;