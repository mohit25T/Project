import express from "express";
import { protect } from '../middleware/authMiddleweare.js';
import { searchUsersByName } from "../controllers/searchController.js";
const router = express.Router();

router.get("/users", protect, searchUsersByName);

export default router;
