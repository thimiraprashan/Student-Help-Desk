import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedArea: { type: String, enum: ['Club', 'Event', 'Sport', 'General'], default: 'General' },
    type: { type: String, enum: ['info', 'reminder', 'celebration'], default: 'info' },
    isRead: { type: Boolean, default: false },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
    reminderType: { type: String, default: null } // 'today', 'tomorrow', '3hours'
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
