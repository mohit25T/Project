import mongoose from "mongoose";
import Post from "../models/Post.js";


// Middleware to check database connection
const checkDBConnection = (res) => {
    if (mongoose.connection.readyState !== 1) {
        console.error("❌ Database not connected!");
        return res.status(500).json({ message: "Database connection error" });
    }
};


// @desc Create a new post with image upload
// @route POST /api/posts
const createPost = async (req, res) => {
    checkDBConnection(res);

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const { caption, region } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const imageUrl = `${file.filename}`; // or your image URL strategy

        const post = await Post.create({
            user: req.user._id,
            caption,
            image: imageUrl,
            region,
        });

        res.status(201).json(post);
    } catch (error) {
        console.error("❌ Error creating post:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// @desc Get all posts (with optional region filtering)
// @route GET /api/posts
const getPosts = async (req, res) => {
    checkDBConnection(res);

    try {
        const region = req.query.region;
        const query = region ? { region } : {};
        const posts = await Post.find(query)
            .populate("user", "name profilePicture")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error("❌ Error fetching posts:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUserPosts = async (req, res) => {
    checkDBConnection(res);

    try {
        const userId = req.params.userId;

        const posts = await Post.find({ user: userId })
            .populate("user", "name profilePicture")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error("❌ Error fetching user's posts:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const likePost = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid post ID format" });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user._id.toString();
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            // Unlike Post
            post.likes = post.likes.filter(id => id.toString() !== userId);
            await post.save();

        } else {
            // Like Post
            post.likes.push(userId);
            await post.save();

        }

        res.json({ message: isLiked ? "Post unliked" : "Post liked", likes: post.likes.length });

    } catch (error) {
        console.error("❌ Error in likePost:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Modify commentOnPost function to trigger notification
const commentOnPost = async (req, res) => {
    checkDBConnection(res);

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { postId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).json({ message: "Comment cannot be empty" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid post ID format" });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = { user: req.user._id, text };
        post.comments.push(newComment);
        await post.save();

        res.status(201).json({ message: "Comment added", comments: post.comments });

    } catch (error) {
        console.error("❌ Error in commentOnPost:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Get comments for a post
// @route GET /api/posts/:postId/comments
const getPostComments = async (req, res) => {
    checkDBConnection(res);

    const { postId } = req.params;

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid post ID format" });
    }

    try {
        const post = await Post.findById(postId).populate("comments.user", "name profilePicture");
        if (!post) return res.status(404).json({ message: "Post not found" });

        res.json(post.comments);
    } catch (error) {
        console.error("❌ Error fetching comments:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export { createPost, getPosts, getUserPosts, likePost, commentOnPost, getPostComments };
