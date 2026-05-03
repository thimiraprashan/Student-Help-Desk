import express from 'express';
import { getClubs, createClub, updateClub, deleteClub, requestJoinClub, getClubRequests, updateClubRequestStatus } from '../controllers/clubController.js';

const router = express.Router();

router.route('/').get(getClubs).post(createClub);
router.route('/requests').get(getClubRequests);
router.route('/requests/:requestId').put(updateClubRequestStatus);
router.route('/:id').put(updateClub).delete(deleteClub);
router.route('/:id/request').post(requestJoinClub);

export default router;
