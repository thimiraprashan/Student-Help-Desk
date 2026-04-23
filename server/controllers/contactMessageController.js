import ContactMessage from "../models/ContactMessage.js";

const normalizeStudentId = (studentId = "") =>
  studentId.trim().toUpperCase().replace(/^IT\s?/, "IT ");

const validateContactMessage = (body) => {
  const requiredFields = [
    "studentId",
    "studentName",
    "studentYear",
    "faculty",
    "reasonType",
    "subject",
    "message",
  ];

  for (const field of requiredFields) {
    if (!body[field] || !String(body[field]).trim()) {
      return `${field} is required.`;
    }
  }

  if (!/^IT\s?\d{8}$/i.test(body.studentId.trim())) {
    return "Student ID must look like IT 23553828.";
  }

  if (body.studentName.trim().length < 2) {
    return "Student name must be at least 2 characters.";
  }

  return null;
};

export const createContactMessage = async (req, res) => {
  try {
    const validationError = validateContactMessage(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const message = await ContactMessage.create({
      ...req.body,
      studentId: normalizeStudentId(req.body.studentId),
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const { status, faculty, reasonType, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (faculty) filter.faculty = faculty;
    if (reasonType) filter.reasonType = reasonType;
    if (search) {
      filter.$or = [
        { studentId: { $regex: search, $options: "i" } },
        { studentName: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateContactMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["New", "Read", "Resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid message status." });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) return res.status(404).json({ error: "Message not found." });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found." });

    res.json({ message: "Contact message deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
