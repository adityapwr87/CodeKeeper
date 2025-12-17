const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const {
  getMyProfile,
  getProfileByUsername,
  updateMyProfile,
  getUserById
} = require("../controllers/userController");
const upload = require("../utils/upload");
// GET /api/users/profile -> Get current user's profile (protected)
router.get("/profile", auth, getMyProfile);

// PUT /api/users/profile -> Update current user's profile (protected)
router.put("/profile", auth, upload.single("profileImage"), updateMyProfile);

// GET /api/users/:username -> Public profile by username
router.get("/:username", getProfileByUsername);
router.get("/id/:userId", getUserById);

module.exports = router;
