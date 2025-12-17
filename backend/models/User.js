const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Profile fields
    name: { type: String },
    profileImage: { type: String },
    bio: { type: String },
    college: { type: String },
    city: { type: String },
    skills: [{ type: String }],
    // Generic handles (e.g. { platform: 'Codeforces', handle: 'sanyam' })
    handles: [
      {
        platform: String,
        handle: String,
        url: String,
      },
    ],
    // Inside your User Schema
    // Inside your User Schema
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookmark", // <--- CHANGE THIS from "Problem" to "Bookmark"
      },
    ],
    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
  },
  { timestamps: true }
);

// hash password before saving
// Password hashing middleware
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// match entered password
userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
