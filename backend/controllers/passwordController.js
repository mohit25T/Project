import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const changePassword = async (req, res) => {
    try {
        // Extract JWT token from HTTP-only cookie
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        // Verify JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find User
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { currentPassword, newPassword } = req.body;

        // Check if the current password matches
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Save updated user
        await user.save();

        console.log("Password Changed Successfully");
        console.log(newPassword);


        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export { changePassword };
