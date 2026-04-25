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

        await createAutoNotification({
            title: `New Sport: ${createdSport.name}`,
            message: `A new ${createdSport.type} ${createdSport.category} sport "${createdSport.name}" has been added. Join now and show your skills!`,
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
            await SportRequest.deleteMany({ sportId: sport._id });
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
        const { studentName, studentId, faculty, qualifications, requestType } = req.body;
        const request = new SportRequest({
            sportId: req.params.id,
            studentName,
            studentId,
            faculty,
            qualifications,
            requestType
        });
        await request.save();
        res.status(201).json({ message: 'Request sent successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getSportRequests = async (req, res) => {
    try {
        const requests = await SportRequest.find({}).populate('sportId', 'name');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSportRequestStatus = async (req, res) => {
    try {
        const { status, meetingDetails } = req.body;
        const request = await SportRequest.findById(req.params.requestId);

        if (request) {
            request.status = status;
            await request.save({ validateModifiedOnly: true });

            const populatedRequest = await SportRequest.findById(request._id).populate('sportId', 'name');
            const sportName = populatedRequest?.sportId?.name || 'this sport';

            if (status === 'Approved') {
                await createAutoNotification({
                    title: `Sport Request Accepted: ${sportName}`,
                    message: `Congratulations ${request.studentName}! Your request to join ${sportName} has been accepted. \n\nMeeting Details: ${meetingDetails || 'To be announced soon.'}`,
                    relatedArea: 'Sport',
                    type: 'celebration'
                });
            } else if (status === 'Rejected') {
                await createAutoNotification({
                    title: `Sport Request Rejected: ${sportName}`,
                    message: `Hello ${request.studentName}, we regret to inform you that your request to join ${sportName} has been rejected at this time.`,
                    relatedArea: 'Sport',
                    type: 'info'
                });
            }

            res.json(populatedRequest || request);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
