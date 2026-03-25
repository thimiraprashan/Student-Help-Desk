import Company from "../Model/CCompanyModel.js";

// GET ALL
const getAllCompanies = async (req, res) => {
  try {
    const data = await Company.find();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ message: "Error" });
  }
};

// ADD
const addCompany = async (req, res) => {
  try {
    const newData = new Company(req.body);
    await newData.save();
    return res.status(201).json({ newData });
  } catch (err) {
    return res.status(500).json({ message: "Error adding" });
  }
};

// GET BY ID
const getById = async (req, res) => {
  try {
    const data = await Company.findById(req.params.id);
    return res.status(200).json({ data });
  } catch {
    return res.status(404).json({ message: "Not found" });
  }
};

// UPDATE
const updateCompany = async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({ updated });
  } catch {
    return res.status(500).json({ message: "Update error" });
  }
};

// DELETE
const deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Deleted" });
  } catch {
    return res.status(500).json({ message: "Delete error" });
  }
};

export default {
  getAllCompanies,
  addCompany,
  getById,
  updateCompany,
  deleteCompany
};