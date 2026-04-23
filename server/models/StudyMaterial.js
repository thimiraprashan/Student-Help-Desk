import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  faculty: { type: String, enum: ["Computing", "Business"], required: true },
  category: { type: String, enum: ["Programming", "Module Guide"], required: true },
  description: { type: String },
  content: { type: String }, // Can be a URL or text
  fileUrl: { type: String }, // For uploaded PDF/Image
}, { timestamps: true });

const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);

export default StudyMaterial;
