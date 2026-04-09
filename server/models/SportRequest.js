import mongoose from 'mongoose';

const SportRequestSchema = new mongoose.Schema({
    sportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    reason: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('SportRequest', SportRequestSchema);
