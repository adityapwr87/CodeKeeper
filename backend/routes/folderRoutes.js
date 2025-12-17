const express = require("express");
const router = express.Router();
const {
  createFolder,
  getFolders,
  getFolderById,
  renameFolder,
  deleteFolder,
  createBookmarkInFolder,
  getBookmarksInFolder,
  removeBookmarkFromFolder,
} = require("../controllers/folderController");
const protect = require("../middleware/authMiddleware");

// Folder CRUD
router.post("/", protect,createFolder);
router.get("/", protect, getFolders);
router.get("/:folderId", protect, getFolderById);
router.put("/:folderId", protect, renameFolder);
router.delete("/:folderId", protect, deleteFolder);

// Folder-specific bookmark routes
router.get("/:folderId/bookmarks", protect, getBookmarksInFolder);
router.post("/:folderId/bookmark", protect, createBookmarkInFolder);
router.delete(
  "/:folderId/bookmark/:bookmarkId",
  protect,
  removeBookmarkFromFolder
);

module.exports = router;
