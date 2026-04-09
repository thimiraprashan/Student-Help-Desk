import express from 'express';
import { getClubs, createClub, updateClub, deleteClub, requestJoinClub } from '../controllers/clubController.js';

const router = express.Router();

router.route('/').get(getClubs).post(createClub);
router.route('/:id').put(updateClub).delete(deleteClub);
router.route('/:id/request').post(requestJoinClub);

export default router;
