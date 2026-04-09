import express from "express";
import CompanyAuth from "../Model/CCompanyAuthModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const companies = await CompanyAuth.find({}, { companyId: 1, name: 1, email: 1 })
      .sort({ companyId: 1 })
      .lean();

    res.json(
      companies.map((company) => ({
        companyId: company.companyId,
        name: company.name,
        email: company.email,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existing = await CompanyAuth.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Company account already exists" });
    }

    const lastCompany = await CompanyAuth.findOne().sort({ companyId: -1 });
    const companyId = lastCompany ? lastCompany.companyId + 1 : 101;

    const company = await CompanyAuth.create({
      companyId,
      name,
      email,
      password,
    });

    res.status(201).json({
      companyId: company.companyId,
      name: company.name,
      email: company.email,
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

    const company = await CompanyAuth.findOne({ email, password });

    if (!company) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      companyId: company.companyId,
      name: company.name,
      email: company.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
