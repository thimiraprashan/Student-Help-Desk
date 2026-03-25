import CompanyProfile from "../Model/CCompanyProfileModel.js";

// 🔥 CREATE
export const createProfile = async (req, res) => {
  try {
    const newProfile = new CompanyProfile(req.body);
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 READ (GET ONE)
export const getProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne(); // single profile
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 UPDATE
export const updateProfile = async (req, res) => {
  try {
    const updated = await CompanyProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 DELETE
export const deleteProfile = async (req, res) => {
  try {
    await CompanyProfile.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};