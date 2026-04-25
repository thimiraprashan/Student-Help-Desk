import CStudentCV from "../Model/CStudentCVModel.js";

// CREATE
export const createCV = async (req, res) => {
  try {
    const newCV = new CStudentCV({
      ...req.body,
      userId: Number(req.body.userId)
    });

    const saved = await newCV.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ
export const getCV = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const data = await CStudentCV.findOne({ userId });

    res.json(data || null);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateCV = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const updated = await CStudentCV.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteCV = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    await CStudentCV.findOneAndDelete({ userId });

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};