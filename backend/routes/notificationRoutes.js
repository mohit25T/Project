// routes/notificationRoutes.js
import express from 'express';
import { getNotifications, deleteNotification } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleweare.js';

const router = express.Router();

router.get('/', protect, getNotifications); // optional
router.delete('/:id', protect, deleteNotification); // optional

export default router;
