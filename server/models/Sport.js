import mongoose from 'mongoose';

const SportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Individual', 'Team'], required: true },
    category: { type: String, enum: ['Indoor', 'Outdoor'], required: true },
    image: { type: String }
}, { timestamps: true });

export default mongoose.model('Sport', SportSchema);
