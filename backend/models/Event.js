import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    location: String,
    region: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;