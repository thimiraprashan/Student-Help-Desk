import Notification from '../models/Notification.js';

/**
 * Create an auto-generated notification
 * @param {Object} options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.relatedArea - 'Club', 'Event', 'Sport', or 'General'
 * @param {string} options.type - 'info', 'reminder', or 'celebration'
 * @param {string} options.eventId - Optional event ID for reminders
 * @param {string} options.reminderType - Optional: 'today', 'tomorrow', '3hours'
 */
export const createAutoNotification = async ({ title, message, relatedArea = 'General', type = 'info', eventId = null, reminderType = null }) => {
    try {
        const notification = new Notification({
            title,
            message,
            relatedArea,
            type,
            eventId,
            reminderType
        });
        await notification.save();
        console.log(`[Notification] ${type}: ${title}`);
        return notification;
    } catch (error) {
        console.error('[Notification Error]', error.message);
    }
};

/**
 * Check if a reminder notification already exists for an event + reminder type
 */
export const reminderExists = async (eventId, reminderType) => {
    const existing = await Notification.findOne({ eventId, reminderType });
    return !!existing;
};
