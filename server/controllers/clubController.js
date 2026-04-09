import Club from '../models/Club.js';
import ClubRequest from '../models/ClubRequest.js';
import { createAutoNotification } from '../utils/notificationHelper.js';

export const getClubs = async (req, res) => {
    try {
        const clubs = await Club.find({});
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createClub = async (req, res) => {
    try {
        const club = new Club(req.body);
        const createdClub = await club.save();

        // Auto-create notification
        await createAutoNotification({
            title: `👥 New Club Added: ${createdClub.name}`,
            message: `A new society "${createdClub.name}" has been formed. Join us and be part of the community!`,
            relatedArea: 'Club',
            type: 'info'
        });

        res.status(201).json(createdClub);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateClub = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (club) {
            Object.assign(club, req.body);
            const updatedClub = await club.save();
            res.json(updatedClub);
        } else {
            res.status(404).json({ message: 'Club not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteClub = async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (club) {
            await club.deleteOne();
            res.json({ message: 'Club removed' });
        } else {
            res.status(404).json({ message: 'Club not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const requestJoinClub = async (req, res) => {
    try {
        const { studentName, studentId, faculty } = req.body;
        const request = new ClubRequest({
            clubId: req.params.id,
            studentName,
            studentId,
            faculty
        });
        const createdRequest = await request.save();
        res.status(201).json(createdRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
