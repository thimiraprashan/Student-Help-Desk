import express from "express";
import CompanyProfile from "../Model/CCompanyProfileModel.js";

const router = express.Router();

// 🔥 GET profile
router.get("/", async (req, res) => {
  const { companyId } = req.query;
  const profile = companyId
    ? await CompanyProfile.findOne({ companyId: Number(companyId) })
    : await CompanyProfile.findOne();
  res.json(profile);
});

// 🔥 CREATE
router.post("/", async (req, res) => {
  const companyId = Number(req.body.companyId);

  if (companyId) {
    const existing = await CompanyProfile.findOne({ companyId });
    if (existing) {
      const updated = await CompanyProfile.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true }
      );
      return res.json(updated);
    }
  }

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
