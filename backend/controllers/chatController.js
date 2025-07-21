import Message from "../models/Message.js";

const getMessages = async (req, res) => {
    const { userId } = req.query;  // Friend's ID

    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: userId },
                { sender: userId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export  {getMessages}
