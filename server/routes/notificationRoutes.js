import express from 'express';
import {
    getNotifications,
    createNotification,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    getTodayNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

router.route('/').get(getNotifications).post(createNotification);
router.get('/unread-count', getUnreadCount);
router.get('/today', getTodayNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
