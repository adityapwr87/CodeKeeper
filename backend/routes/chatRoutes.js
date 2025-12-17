const express = require("express");
const router = express.Router();
const { getChatHistory } = require("../controllers/chatController");
const protect = require("../middleware/authmiddleware");

router.get("/", protect, getChatHistory);
module.exports = router;
