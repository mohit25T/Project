import User from "../models/User.js";
import Notification from "../models/Notification.js";
const followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        if (userId === currentUserId.toString()) {
            return res.status(400).json({ message: "You can't follow yourself." });
        }

        const userToFollow = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: "User not found." });
        }

        if (userToFollow.followers.includes(currentUserId)) {
            return res.status(400).json({ message: "Already following this user." });
        }

        userToFollow.followers.push(currentUserId);
        currentUser.following.push(userId);

        // In your follow controller
        await Notification.create({
            type: 'follow',
            sender: req.user.id,
            receiver: userId,
        });
        await userToFollow.save();
        await currentUser.save();

        res.json({ message: "Followed successfully." });
    } catch (error) {
        console.error("Error following user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const userToUnfollow = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: "User not found." });
        }

        userToUnfollow.followers = userToUnfollow.followers.filter(
            id => id.toString() !== currentUserId.toString()
        );
        currentUser.following = currentUser.following.filter(
            id => id.toString() !== userId.toString()
        );

        await userToUnfollow.save();
        await currentUser.save();

        res.json({ message: "Unfollowed successfully." });
    } catch (error) {
        console.error("Error unfollowing user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const checkFollowStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found." });

        const isFollowing = user.followers.includes(currentUserId);
        res.json({ isFollowing });
    } catch (error) {
        console.error("Error checking follow status:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("followers", "name profilePicture region");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ followers: user.followers });
    } catch (error) {
        console.error("Error getting followers:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("following", "name profilePicture region");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ following: user.following });
    } catch (error) {
        console.error("Error getting following list:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


export { followUser, unfollowUser, checkFollowStatus ,getFollowers,getFollowing}