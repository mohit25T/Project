import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleweare.js";
import upload from "../middleware/uploadMiddleweare.js";


const router = express.Router();

router.post("/register", upload.single('profile_pic'), registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getCurrentProfile);
router.post("/logout", protect, logoutUser); // Protect logout route

export default router;
