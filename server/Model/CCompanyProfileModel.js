import mongoose from "mongoose";

const CompanyDetailSchema = new mongoose.Schema(
  {
    title: String,
    value: String,
  },
  { _id: false }
);

const CompanyProfileSchema = new mongoose.Schema({
  companyId: Number,
  name: String,
  email: String,
  phone: String,
  location: String,
  purpose: String,
  details: {
    type: [CompanyDetailSchema],
    default: [],
  },
}, { timestamps: true });

export default mongoose.model("CCompanyProfile", CompanyProfileSchema);
