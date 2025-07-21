import User from "../models/User.js";
import path from "path";

export const searchUsersByName = async (req, res) => {
  const { name } = req.query;
  const currentUserId = req.user?._id?.toString(); // make sure it’s a string for comparison

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Search name is required" });
  }

  try {
    // Step 1: Find users with matching name (excluding current user)
    const matchedUsers = await User.find({
      name: { $regex: name, $options: "i" },
      _id: { $ne: currentUserId },
    }).select("_id name region");

    if (matchedUsers.length === 0) {
      return res.status(404).json({ message: "No users found with that name." });
    }

    // Step 2: Fetch profile picture for each user
    const usersWithPics = await Promise.all(
      matchedUsers.map(async (user) => {
        const fullUser = await User.findById(user._id).select("profilePicture");
        const profilePicPath = `${path.basename(fullUser.profilePicture)}`

        return {
          _id: user._id,
          name: user.name,
          region: user.region,
          profile_pic: profilePicPath,
        };
      })
    );

    res.json(usersWithPics);
  } catch (error) {
    console.error("❌ Error searching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
