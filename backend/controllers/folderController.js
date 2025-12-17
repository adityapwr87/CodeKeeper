const Folder = require("../models/Folder");
const Bookmark = require("../models/Bookmark");

/* ===============================
   CREATE FOLDER
================================ */
exports.createFolder = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const folder = await Folder.create({
      user: req.user.id,
      name,
      description,
    });

    return res.status(201).json(folder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

/* ===============================
   GET ALL FOLDERS
================================ */
exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json(folders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

/* ===============================
   GET FOLDER BY ID (WITH BOOKMARKS)
================================ */
exports.getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      user: req.user.id,
    }).populate({
      path: "bookmarks",
      options: { sort: { createdAt: -1 } },
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(folder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

/* ===============================
   RENAME FOLDER
================================ */
exports.renameFolder = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.folderId, user: req.user.id },
      { name },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(folder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

/* ===============================
   DELETE FOLDER + ITS BOOKMARKS
================================ */
exports.deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user.id;

    // 1️⃣ Check ownership
    const folder = await Folder.findOne({ _id: folderId, user: userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // 2️⃣ Delete all bookmarks inside folder
    await Bookmark.deleteMany({ folder: folderId, user: userId });

    // 3️⃣ Delete folder
    await Folder.deleteOne({ _id: folderId, user: userId });

    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while deleting folder",
      error: error.message,
    });
  }
};

/* ===============================
   CREATE BOOKMARK IN FOLDER
================================ */
exports.createBookmarkInFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { title, link, tags, solution } = req.body;

    if (!title || !link) {
      return res.status(400).json({ message: "Title and link are required" });
    }

    const folder = await Folder.findOne({
      _id: folderId,
      user: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const bookmark = await Bookmark.create({
      user: req.user.id,
      folder: folderId,
      title,
      link,
      tags: tags || [],
      solution: solution || "",
    });

    // Add bookmark to folder
    folder.bookmarks.push(bookmark._id);
    await folder.save();

    return res.status(201).json(bookmark);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

/* ===============================
   GET BOOKMARKS IN FOLDER
================================ */
exports.getBookmarksInFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.folderId,
      user: req.user.id,
    }).populate({
      path: "bookmarks",
      options: { sort: { createdAt: -1 } },
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(folder.bookmarks);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

/* ===============================
   REMOVE BOOKMARK FROM FOLDER
================================ */
exports.removeBookmarkFromFolder = async (req, res) => {
  try {
    const { folderId, bookmarkId } = req.params;
    const userId = req.user.id;

    const folder = await Folder.findOne({ _id: folderId, user: userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const bookmark = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      user: userId,
      folder: folderId,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    // Remove bookmark reference from folder
    await Folder.findByIdAndUpdate(folderId, {
      $pull: { bookmarks: bookmarkId },
    });

    return res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
