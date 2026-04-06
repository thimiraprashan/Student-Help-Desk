import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    companyId: {
      type: Number,
      default: null,
    },
    company: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
