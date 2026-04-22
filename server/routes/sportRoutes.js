import express from 'express';
import { getSports, createSport, updateSport, deleteSport, requestSport, getSportRequests, updateSportRequestStatus } from '../controllers/sportController.js';

const router = express.Router();

router.route('/').get(getSports).post(createSport);
router.route('/requests').get(getSportRequests);
router.route('/requests/:requestId').put(updateSportRequestStatus);
router.route('/:id').put(updateSport).delete(deleteSport);
router.route('/:id/request').post(requestSport);

export default router;
