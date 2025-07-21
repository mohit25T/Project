import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String, required: true },
    image: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    region: { type: String, required: true }, // Region-Based Filtering
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
