import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// @desc Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password, region } = req.body;
    const profile_pic = req.file ? `${req.file.filename}` : null;

    console.log({ name, email, profile_pic, password, region });

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, profilePicture: profile_pic, password: hashedPassword, region });

        if (user) {
            generateToken(res, user._id);
            console.log("User created......")
            res.status(201).json({ _id: user._id, profilePicture: user.profile_pic, name: user.name, email: user.email, region: user.region });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ message: "Invalid email or password" });

        // ✅ Generate and store token using helper function
        const token = generateToken(res, user._id.toString());

        user.lastLogin = new Date();
        await user.save();

        console.log("Login Successful:", {
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
            token, // ✅ Return token for debugging if needed
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getCurrentProfile = async (req, res) => {
    try {
        // Extract user ID from req.user (assuming authentication middleware sets it)
        const user = await User.findById(req.user._id).select("-password"); // Exclude password field

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            profile_pic: user.profilePicture,
            email: user.email,
            region: user.region,
            followers: user.followers,
            following: user.following,
            lastLogin: user.lastLogin,
        });
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const logoutUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { password } = req.body; // Get password from request body

        if (!userId || !password) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Update last logout time
        user.lastLogout = new Date();
        await user.save();

        // Clear the cookie
        res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
        res.json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { registerUser, loginUser, logoutUser, getCurrentProfile };
