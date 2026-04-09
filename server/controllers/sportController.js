import Sport from '../models/Sport.js';
import SportRequest from '../models/SportRequest.js';
import { createAutoNotification } from '../utils/notificationHelper.js';

export const getSports = async (req, res) => {
    try {
        const sports = await Sport.find({});
        res.json(sports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSport = async (req, res) => {
    try {
        const sport = new Sport(req.body);
        const createdSport = await sport.save();

        // Auto-create notification
        await createAutoNotification({
            title: `🏆 New Sport: ${createdSport.name}`,
            message: `A new ${createdSport.type} ${createdSport.category} sport "${createdSport.name}" has been added. Join now and show your skills! 💪`,
            relatedArea: 'Sport',
            type: 'celebration'
        });

        res.status(201).json(createdSport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSport = async (req, res) => {
    try {
        const sport = await Sport.findById(req.params.id);
        if (sport) {
            Object.assign(sport, req.body);
            const updatedSport = await sport.save();
            res.json(updatedSport);
        } else {
            res.status(404).json({ message: 'Sport not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSport = async (req, res) => {
    try {
        const sport = await Sport.findById(req.params.id);
        if (sport) {
            await sport.deleteOne();
            res.json({ message: 'Sport removed' });
        } else {
            res.status(404).json({ message: 'Sport not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const requestSport = async (req, res) => {
    try {
        const { studentName, studentId, reason } = req.body;
        const request = new SportRequest({
            sportId: req.params.id,
            studentName,
            studentId,
            reason
        });
        await request.save();
        res.status(201).json({ message: 'Request sent successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
