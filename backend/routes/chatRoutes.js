import express from "express";
import { getMessages } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleweare.js";

const router = express.Router();

// ✅ GET messages between logged-in user and receiver
router.get("/", protect, getMessages);

export default router;
