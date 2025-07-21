import express from "express";
import { followUser, unfollowUser, checkFollowStatus, getFollowers, getFollowing } from "../controllers/friendController.js";
import { protect } from "../middleware/authMiddleweare.js";

const router = express.Router();
router.post("/follow/:userId", protect, followUser);
router.post("/unfollow/:userId", protect, unfollowUser);
router.get("/follow-status/:userId", protect, checkFollowStatus);

router.get("/followers/:userId", protect, getFollowers);
router.get("/following/:userId", protect, getFollowing);


export default router;
