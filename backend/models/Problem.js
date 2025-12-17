const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a problem title"],
    },
    link: {
      type: String,
      required: [true, "Please add a link to the problem"],
    },
    tags: {
      type: [String],
      default: [],
    },
    solution: {
      type: String,
      default: "",
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: { type: String, required: true }, 
        text: { type: String, required: true },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Problem", problemSchema);
