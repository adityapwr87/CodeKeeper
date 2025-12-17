import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiExternalLink,
  FiTrash2,
  FiPlus,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";
import ProblemCardBookmark from "./ProblemCardBookmark";
import { toast } from "react-toastify";
import {
  getBookmarksInFolder,
  addBookmarkToFolder,
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
  const [isRemoving, setIsRemoving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    link: "",
    tags: "",
    solution: "",
  });

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

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        link: form.link,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        solution: form.solution,
      };
      const { data } = await addBookmarkToFolder(id, payload);
      setBookmarks((prev) => [data, ...prev]);
      setIsAddOpen(false);
      setForm({ title: "", link: "", tags: "", solution: "" });
      toast.success("Bookmark added successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add bookmark");
    }
  };

  const handleRemove = async (bookmarkId) => {
    if (!window.confirm("Remove bookmark?")) return;
    try {
      setIsRemoving(true);
      await removeBookmarkFromFolder(id, bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
      toast.success("Bookmark removed successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
                isRemoving={isRemoving}
              />
            ))}
          </div>
        )}

        {isAddOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Add Bookmark</h2>
                <button
                  className="close-btn"
                  onClick={() => setIsAddOpen(false)}
                >
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Link</label>
                  <input
                    name="link"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Solution (optional)</label>
                  <textarea
                    name="solution"
                    value={form.solution}
                    onChange={(e) =>
                      setForm({ ...form, solution: e.target.value })
                    }
                    rows="5"
                  />
                </div>
                <button type="submit" className="btn-gradient full-width">
                  Add Bookmark
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Folder;
