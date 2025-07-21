import express from "express";
import { generateReply, getChatHistory } from "../controllers/chatbotController.js";
const router = express.Router();

router.post("/", generateReply);
router.get("/history", getChatHistory); // 👈 Add this route

export default router;
