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


router.get("/profile", auth, getMyProfile);
router.put("/profile", auth, upload.single("profileImage"), updateMyProfile);
router.get("/:username", getProfileByUsername);
router.get("/id/:userId", getUserById);

module.exports = router;
