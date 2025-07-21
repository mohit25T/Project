import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: { type: String, enum: ['follow', 'post'], required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;