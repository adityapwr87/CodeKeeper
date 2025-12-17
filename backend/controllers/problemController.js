const Problem = require("../models/Problem");
const User = require("../models/User"); // Import User model
const Bookmark=require("../models/Bookmark");
// @desc    Get all problems for the logged-in user
// @route   GET /api/problems
// @access  Private
exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}).sort({ createdAt: -1 }).limit(100);

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.addProblem = async (req, res) => {
  try {
    const { title, link, tags, solution } = req.body;

    if (!title || !link) {
      return res.status(400).json({ message: "Title and Link are required" });
    }

    const problem = await Problem.create({
      user: req.user.id, 
      title,
      link,
      tags,
      solution,
    });

    res.status(201).json(problem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add problem", error: error.message });
  }
};


exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const newComment = {
      user: req.user.id,
      username: req.user.username, 
      text,
    };

    problem.comments.unshift(newComment);

    await problem.save();

    res.status(201).json(problem.comments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};




