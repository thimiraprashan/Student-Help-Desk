import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedArea: { type: String, enum: ['Club', 'Event', 'Sport', 'General'], default: 'General' },
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
