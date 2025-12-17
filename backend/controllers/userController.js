const User = require("../models/User");
const uploadtos3 = require("../utils/s3Upload");
// Get current user's profile (protected)
exports.getMyProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get public profile by username
exports.getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;

    const allowed = ["name", "bio", "college", "city", "skills", "handles"];

    const payload = {};

    // allow only whitelisted fields
    Object.keys(updates).forEach((key) => {
      if (allowed.includes(key)) {
        payload[key] = updates[key];
      }
    });

    // handle file upload
    if (req.file) {
      const imageUrl = await uploadtos3(req.file);
      payload.profileImage = imageUrl; // or profileImage if your schema uses that
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: payload },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("User found:", user);
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
