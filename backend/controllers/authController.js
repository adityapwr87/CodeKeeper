const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper to generate JWT Token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// ===========================
// SIGNUP CONTROLLER
// ===========================
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if Username is already taken
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: "Username is already taken. Please choose another." });
    }

    // 2. Check if Email is already registered
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .json({ message: "Email is already registered. Please login." });
    }

    // 3. Create User (Password is hashed automatically by User model pre-save hook)
    const user = await User.create({ username, email, password });

    // 4. Generate Token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Signup success",
      user: { _id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// ===========================
// LOGIN CONTROLLER
// ===========================
exports.login = async (req, res) => {
  try {
    // We accept 'email' from frontend, but we treat it as 'emailOrUsername'
    // to allow flexibility in the database query.
    const { email, password } = req.body;

    // 1. Find user by Email OR Username
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Check Password using the method in User.js
    const correct = await user.matchPassword(password);
    if (!correct) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate Token
    const token = generateToken(user._id);

    res.json({
      message: "Login success",
      user: { _id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

