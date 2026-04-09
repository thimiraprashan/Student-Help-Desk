import mongoose from "mongoose";

const CStudentCVSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  name: String,
  email: String,
  field: String,
  year: Number,
  phone: String,
  gpa: String,
  bio: String,
  cvName: String,
  cv: String
}, { timestamps: true });

export default mongoose.model("CStudentCV", CStudentCVSchema);