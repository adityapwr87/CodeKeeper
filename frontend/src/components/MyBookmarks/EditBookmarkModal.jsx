import React, { useState, useEffect } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { updateBookmarkInFolder } from "../../api/api"; // Adjust path as needed
import AudioRecorder from "./AudioRecorder";
import "./EditBookmarkModal.css"; // Import the separate CSS

const EditBookmarkModal = ({
  isOpen,
  onClose,
  folderId,
  bookmarkData,
  onBookmarkUpdated,
}) => {
  const [form, setForm] = useState({
    title: "",
    link: "",
    tags: "",
    solution: "",
  });
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate form when modal opens with existing data
  useEffect(() => {
    if (bookmarkData && isOpen) {
      setForm({
        title: bookmarkData.title || "",
        link: bookmarkData.link || "",
        tags: bookmarkData.tags ? bookmarkData.tags.join(", ") : "",
        solution: bookmarkData.solution || "",
      });
      // Note: We do NOT set audioBlob here.
      // The AudioRecorder receives the 'currentAudioUrl' prop to show the existing file.
    }
  }, [bookmarkData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("link", form.link);
    formData.append("solution", form.solution);
    formData.append("tags", form.tags);

    // Only append audio if the user recorded a NEW one
    if (audioBlob) {
      formData.append("audio", audioBlob, "voice-note-updated.webm");
    }

    try {
      const { data } = await updateBookmarkInFolder(
        folderId,
        bookmarkData._id,
        formData
      );

      toast.success("Bookmark updated successfully!");
      onBookmarkUpdated(data); // Refresh the list in parent
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bookmark.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content slide-in">
        {/* Header */}
        <div className="edit-modal-header">
          <h2>Edit Bookmark</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-modal-form">
          {/* Title */}
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="modal-input"
            />
          </div>

          {/* Link */}
          <div className="form-group">
            <label>Link</label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              required
              className="modal-input"
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>
              Tags <span className="sub-label">(comma separated)</span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="modal-input"
              placeholder="dp, arrays, sliding window"
            />
          </div>

          {/* Audio Recorder Section */}
          <div className="form-group audio-section">
            <label>Voice Logic</label>
            <div className="audio-wrapper">
              <AudioRecorder
                onAudioStop={setAudioBlob}
                currentAudioUrl={bookmarkData?.audioUrl}
              />
            </div>
            {/* Helper Text */}
            <div className="audio-helper-text">
              <FiAlertCircle className="icon-small" />
              <span>Recording a new note will replace the existing one.</span>
            </div>
          </div>

          {/* Solution */}
          <div className="form-group">
            <label>Solution / Notes</label>
            <textarea
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
              rows="5"
              className="modal-textarea"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-update full-width"
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBookmarkModal;
