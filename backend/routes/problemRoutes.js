const express = require("express");
const router = express.Router();
const {
  getProblems,
  addProblem,
  addComment, // <--- Import the new function
} = require("../controllers/problemController");
const protect = require("../middleware/authMiddleware");

// --- BOOKMARK ROUTES ---


router.get("/", protect, getProblems);

// Add a new problem
router.post("/", protect, addProblem);

// --- Comment Route (http://localhost:5000/api/problems/:id/comments) ---

// Add a comment to a specific problem
router.post("/:id/comments", protect, addComment);

// Add these routes:
// (duplicates removed) routes are defined above already in correct order

module.exports = router;
