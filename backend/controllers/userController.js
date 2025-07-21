import jwt from "jsonwebtoken";
import User from "../models/User.js";
import path from "path";


const updateUserProfile = async (req, res) => {
    try {
        // Extract JWT token from HTTP-only cookie
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        // Verify JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields (exclude password)
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.region) user.region = req.body.region;

        // Save updated user
        await user.save();

        console.log("Profile Updated Successfully", {
            _id: user._id,
            name: user.name,
            email: user.email,
            region: user.region,
            lastLogin: user.lastLogin,
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            region: user.region,
            lastLogin: user.lastLogin,
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getSingleUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("name region profilePicture following followers");

        console.log("📸 Raw user from DB:", user); // Add this

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile_pic = user.profilePicture

        res.json({
            _id: user._id,
            name: user.name,
            region: user.region,
            profile_pic,
            followersCount: Array.isArray(user.followers) ? user.followers.length : 0,
            followingCount: Array.isArray(user.following) ? user.following.length : 0,
        });
    } catch (error) {
        console.error("❌ Error fetching user profile:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};




export { updateUserProfile, getSingleUserProfile };
