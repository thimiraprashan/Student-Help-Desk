import mongoose from "mongoose";

const Schema = mongoose.Schema;

const companySchema = new Schema({
  companyId: {
    type: Number,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  field: String,
  location: String,
  duration: String,
  deadline: String,
  skills: [String],
  description: String
});

export default mongoose.model("CCompany", companySchema);
