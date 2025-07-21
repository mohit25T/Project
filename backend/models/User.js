import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        profilePicture: { type: String, required: true },
        password: { type: String, required: true },
        region: { type: String, required: true }, // Region-based filtering
        lastLogin: { type: Date, default: Date.now },
        lastLogout: { type: Date, default: Date.now },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users following this person
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users this person follows
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
