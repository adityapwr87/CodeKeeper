import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";
import ProblemCardBookmark from "./ProblemCardBookmark";
import AddBookmarkModal from "./AddBookmarkModal";
// ✅ Import Edit Modal
import EditBookmarkModal from "./EditBookmarkModal";

import {
  getBookmarksInFolder,
  removeBookmarkFromFolder,
  getFolderById,
} from "../../api/api";
import "./MyBookmarks.css";
import "./Folder.css";

const Folder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); // ✅ Edit Modal State
  const [editingBookmark, setEditingBookmark] = useState(null); // ✅ Data for editing

  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: folderData } = await getFolderById(id);
        setFolder(folderData);
        const { data: bk } = await getBookmarksInFolder(id);
        setBookmarks(bk);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookmarkAdded = (newBookmark) => {
    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  // ✅ Handle Update Success
  const handleBookmarkUpdated = (updatedBookmark) => {
    setBookmarks((prev) =>
      prev.map((b) => (b._id === updatedBookmark._id ? updatedBookmark : b))
    );
  };

  // ✅ Trigger Edit
  const handleEditClick = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsEditOpen(true);
  };

  const handleRemove = async (bookmarkId) => {
    if (!window.confirm("Remove bookmark?")) return;
    try {
      setIsRemoving(true);
      await removeBookmarkFromFolder(id, bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
      toast.success("Bookmark removed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to remove bookmark");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container folder-page">
        <div className="folder-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft />
          </button>
          <div>
            <h2>{folder?.name || "Folder"}</h2>
            <p className="muted">{folder?.description}</p>
          </div>
          <div className="header-actions">
            <button className="btn-gradient" onClick={() => setIsAddOpen(true)}>
              <FiPlus /> Add Bookmark
            </button>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Loading bookmarks...</p>
        ) : bookmarks.length === 0 ? (
          <div className="empty-state">
            <h3>No bookmarks yet</h3>
            <p>Add bookmarks using the button above</p>
          </div>
        ) : (
          <div className="bookmarks-list">
            {bookmarks.map((b) => (
              <ProblemCardBookmark
                key={b._id}
                data={b}
                onRemove={handleRemove}
                onEdit={handleEditClick} // ✅ Pass Edit Handler
                isRemoving={isRemoving}
              />
            ))}
          </div>
        )}

        {/* Add Modal */}
        <AddBookmarkModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          folderId={id}
          onBookmarkAdded={handleBookmarkAdded}
        />

        {/* ✅ Edit Modal */}
        {editingBookmark && (
          <EditBookmarkModal
            isOpen={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
              setEditingBookmark(null);
            }}
            folderId={id}
            bookmarkData={editingBookmark}
            onBookmarkUpdated={handleBookmarkUpdated}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Folder;
