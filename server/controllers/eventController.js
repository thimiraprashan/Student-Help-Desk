import Event from '../models/Event.js';
import { createAutoNotification } from '../utils/notificationHelper.js';

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ startDate: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        const createdEvent = await event.save();

        // Auto-create notification
        const eventDate = new Date(createdEvent.startDate);
        await createAutoNotification({
            title: `📅 New Event: ${createdEvent.title}`,
            message: `A new ${createdEvent.category} event "${createdEvent.title}" has been added on ${eventDate.toLocaleDateString()} at ${createdEvent.venue}. Don't miss it!`,
            relatedArea: 'Event',
            type: 'info',
            eventId: createdEvent._id
        });

        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            Object.assign(event, req.body);
            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
