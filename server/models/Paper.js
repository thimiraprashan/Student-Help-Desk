import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    faculty: { type: String, enum: ["Computing", "Business"], required: true },
    moduleCode: { type: String, trim: true },
    moduleName: { type: String, trim: true },
    year: { type: Number, required: true },
    semester: { type: String, enum: ["Semester 1", "Semester 2", "Other"], default: "Other" },
    examType: { type: String, enum: ["Midterm", "Final", "Quiz", "Other"], default: "Final" },
    description: { type: String, trim: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileMimeType: { type: String },
  },
  { timestamps: true }
);

const Paper = mongoose.model("Paper", paperSchema);

export default Paper;
