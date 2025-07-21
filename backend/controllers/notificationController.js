import Notification from "../models/Notification.js";

// GET all notifications for the current user
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver: req.user.id })
            .sort({ createdAt: -1 })
            .populate('sender', 'name profilePicture') // Get sender's name & profile_pic
            .populate('post', 'content'); // Optional: get post content

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
};

// Delete Notification by ID
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export { getNotifications, deleteNotification };
