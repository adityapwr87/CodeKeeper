const express = require("express");
const router = express.Router();
const {
  getProblems,
  addProblem,
  addComment, 
} = require("../controllers/problemController");
const protect = require("../middleware/authmiddleware");

router.get("/", protect, getProblems);

// Add a new problem
router.post("/", protect, addProblem);


router.post("/:id/comments", protect, addComment);

module.exports = router;
