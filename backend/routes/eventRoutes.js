import express from 'express';
import { createEvent, getEvents, rsvpEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleweare.js';

const router = express.Router();

router.post("/", createEvent); // 🔓 No token required
router.get("/", getEvents);
router.post("/:id/rsvp", rsvpEvent);

export default router;
