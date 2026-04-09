import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    venue: { type: String, required: true },
    image: { type: String },
    ticketPrice: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Event', EventSchema);
