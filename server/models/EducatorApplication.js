import mongoose from "mongoose";

const educatorApplicationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    studentId: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    faculty: { type: String, required: true },
    department: { type: String, required: true },
    yearOfStudy: { type: String, required: true },
    semester: { type: String, required: true },
    currentGpa: { type: Number, required: true },
    subjectToSupport: { type: String, required: true },
    moduleCode: { type: String, required: true },
    gradeObtained: { type: String, required: true },
    preferredTimeSlots: { type: String, required: true },
    sessionFormat: { type: String, enum: ['Physical', 'Online', 'Both'], required: true },
    reasonToConduct: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    rejectionReason: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const EducatorApplication = mongoose.model('EducatorApplication', educatorApplicationSchema);

export default EducatorApplication;
