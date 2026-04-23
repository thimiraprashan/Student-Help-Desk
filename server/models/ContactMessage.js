import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
      match: [/^IT\s?\d{8}$/i, "Student ID must look like IT 23553828"],
    },
    studentName: { type: String, required: true, trim: true },
    studentYear: {
      type: String,
      enum: ["Year 1", "Year 2", "Year 3", "Year 4"],
      required: true,
    },
    faculty: {
      type: String,
      enum: ["Computing", "Business", "Engineering", "Humanities & Sciences", "Graduate Studies"],
      required: true,
    },
    reasonType: {
      type: String,
      enum: ["Academic Support", "Technical Issue", "Past Papers", "Study Guide", "General Inquiry", "Other"],
      required: true,
    },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["New", "Read", "Resolved"],
      default: "New",
    },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
