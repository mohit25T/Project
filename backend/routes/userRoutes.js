import express from 'express';
import { updateUserProfile, getSingleUserProfile } from '../controllers/userController.js';
import { protect } from "../middleware/authMiddleweare.js";

const router = express.Router();

// Update profile route
router.put("/update", protect, updateUserProfile);
router.get("/:id", getSingleUserProfile);



export default router;
