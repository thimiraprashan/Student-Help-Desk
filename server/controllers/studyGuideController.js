import StudyMaterial from "../models/StudyMaterial.js";

export const addStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.create(req.body);
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudyMaterials = async (req, res) => {
  try {
    const { faculty, category } = req.query;
    const filter = {};
    if (faculty) filter.faculty = faculty;
    if (category) filter.category = category;
    
    const materials = await StudyMaterial.find(filter);
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ error: "Material not found" });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ error: "Material not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
