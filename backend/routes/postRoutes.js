import express from "express";
import { createPost, getPosts, getUserPosts, likePost, commentOnPost, getPostComments } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleweare.js";
import upload from "../middleware/uploadMiddleweare.js";

const router = express.Router();

router.route("/").post(protect, upload.single("image"), createPost).get(getPosts);
router.get('/user/:userId', getUserPosts);
router.put("/:postId/like", protect, likePost);
router.put("/:postId/comment", protect, commentOnPost);
router.get("/:postId/comments", protect, getPostComments);


export default router;
