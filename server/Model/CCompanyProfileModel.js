import mongoose from "mongoose";

const CompanyProfileSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  location: String,
  purpose: String,
}, { timestamps: true });

export default mongoose.model("CCompanyProfile", CompanyProfileSchema);