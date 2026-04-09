import cron from 'node-cron';
import Event from '../models/Event.js';
import { createAutoNotification, reminderExists } from './notificationHelper.js';

/**
 * Event Reminder Scheduler
 * Runs every hour to check for upcoming events and create reminder notifications.
 */
const startReminderScheduler = () => {
    // Run every hour at minute 0
    cron.schedule('0 * * * *', async () => {
        console.log('[Scheduler] Checking for upcoming event reminders...');
        try {
            const now = new Date();
            const events = await Event.find({ startDate: { $gte: now } });

            for (const event of events) {
                const eventDate = new Date(event.startDate);
                const diffMs = eventDate - now;
                const diffHours = diffMs / (1000 * 60 * 60);
                const diffDays = diffMs / (1000 * 60 * 60 * 24);

                // 3 hours before reminder
                if (diffHours <= 3 && diffHours > 0) {
                    const exists = await reminderExists(event._id, '3hours');
                    if (!exists) {
                        await createAutoNotification({
                            title: `⏰ Starting Soon: ${event.title}`,
                            message: `"${event.title}" starts in about ${Math.round(diffHours)} hour(s) at ${event.venue}. Get ready!`,
                            relatedArea: 'Event',
                            type: 'reminder',
                            eventId: event._id,
                            reminderType: '3hours'
                        });
                    }
                }

                // Tomorrow reminder (between 24-48 hours)
                if (diffDays <= 2 && diffDays > 1) {
                    const exists = await reminderExists(event._id, 'tomorrow');
                    if (!exists) {
                        await createAutoNotification({
                            title: `📅 Tomorrow: ${event.title}`,
                            message: `"${event.title}" is happening tomorrow at ${event.venue}. Don't forget to prepare!`,
                            relatedArea: 'Event',
                            type: 'reminder',
                            eventId: event._id,
                            reminderType: 'tomorrow'
                        });
                    }
                }

                // Today reminder (between 0-24 hours, but more than 3 hours)
                if (diffDays <= 1 && diffHours > 3) {
                    const exists = await reminderExists(event._id, 'today');
                    if (!exists) {
                        await createAutoNotification({
                            title: `🎉 Today: ${event.title}`,
                            message: `"${event.title}" is happening today at ${event.venue}! Let's celebrate! 🎊`,
                            relatedArea: 'Event',
                            type: 'celebration',
                            eventId: event._id,
                            reminderType: 'today'
                        });
                    }
                }
            }
        } catch (error) {
            console.error('[Scheduler Error]', error.message);
        }
    });

    // Also run immediately on startup
    (async () => {
        console.log('[Scheduler] Running initial reminder check...');
        try {
            const now = new Date();
            const events = await Event.find({ startDate: { $gte: now } });

            for (const event of events) {
                const eventDate = new Date(event.startDate);
                const diffMs = eventDate - now;
                const diffHours = diffMs / (1000 * 60 * 60);
                const diffDays = diffMs / (1000 * 60 * 60 * 24);

                if (diffHours <= 3 && diffHours > 0) {
                    const exists = await reminderExists(event._id, '3hours');
                    if (!exists) {
                        await createAutoNotification({
                            title: `⏰ Starting Soon: ${event.title}`,
                            message: `"${event.title}" starts in about ${Math.round(diffHours)} hour(s) at ${event.venue}. Get ready!`,
                            relatedArea: 'Event',
                            type: 'reminder',
                            eventId: event._id,
                            reminderType: '3hours'
                        });
                    }
                }

                if (diffDays <= 2 && diffDays > 1) {
                    const exists = await reminderExists(event._id, 'tomorrow');
                    if (!exists) {
                        await createAutoNotification({
                            title: `📅 Tomorrow: ${event.title}`,
                            message: `"${event.title}" is happening tomorrow at ${event.venue}. Don't forget to prepare!`,
                            relatedArea: 'Event',
                            type: 'reminder',
                            eventId: event._id,
                            reminderType: 'tomorrow'
                        });
                    }
                }

                if (diffDays <= 1 && diffHours > 3) {
                    const exists = await reminderExists(event._id, 'today');
                    if (!exists) {
                        await createAutoNotification({
                            title: `🎉 Today: ${event.title}`,
                            message: `"${event.title}" is happening today at ${event.venue}! Let's celebrate! 🎊`,
                            relatedArea: 'Event',
                            type: 'celebration',
                            eventId: event._id,
                            reminderType: 'today'
                        });
                    }
                }
            }
        } catch (error) {
            console.error('[Scheduler Initial Error]', error.message);
        }
    })();

    console.log('[Scheduler] Event reminder scheduler started (runs every hour)');
};

export default startReminderScheduler;
