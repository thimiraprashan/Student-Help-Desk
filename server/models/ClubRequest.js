import mongoose from 'mongoose';

const ClubRequestSchema = new mongoose.Schema({
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    faculty: { type: String, enum: ['Computing', 'Business', 'Engineering'], required: true },
    year: { type: String, enum: ['1st year', '2nd year', '3rd year', '4th year'], required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('ClubRequest', ClubRequestSchema);
