import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const { area } = req.query;
        const filter = area ? { relatedArea: area } : {};
        const notifications = await Notification.find(filter).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        const createdNotification = await notification.save();
        res.status(201).json(createdNotification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
