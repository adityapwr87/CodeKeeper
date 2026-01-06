import React, { useState } from "react";
import {
  FiTrash2,
  FiExternalLink,
  FiCode,
  FiEdit2,
  FiMic,
} from "react-icons/fi";

const ProblemCardBookmark = ({ data, onRemove, onEdit, isRemoving }) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="problem-card bookmark-card">
      {/* Card Top */}
      <div className="card-top">
        <h3 className="prob-title">{data.title}</h3>

        <div className="card-actions-top">
          {/* ✅ Edit Button */}
          <button
            className="btn-icon edit"
            onClick={() => onEdit(data)} // Pass full data to parent
          >
            <FiEdit2 />
          </button>

          <button
            className="btn-icon delete"
            onClick={() => onRemove(data._id)}
            disabled={isRemoving}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="tags-row">
        {(data.tags || []).map((tag, idx) => (
          <span key={idx} className="tag-badge">
            # {tag}
          </span>
        ))}
      </div>

      {/* Link */}
      <a
        href={data.link}
        target="_blank"
        rel="noreferrer"
        className="prob-link"
      >
        <FiExternalLink /> View Problem
      </a>

      {/* ✅ Audio Player (Only if audioUrl exists) */}
      {data.audioUrl && (
        <div className="audio-player-wrapper mt-3 mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <FiMic /> <span>Voice Note</span>
          </div>
          <audio controls src={data.audioUrl} className="w-full h-8" />
        </div>
      )}

      {/* Solution Toggle */}
      {data.solution && (
        <div className="card-actions mt-2">
          <button
            className={`btn-green ${showSolution ? "active" : ""}`}
            onClick={() => setShowSolution(!showSolution)}
          >
            <FiCode /> {showSolution ? "Hide Solution" : "Show Solution"}
          </button>
        </div>
      )}

      {/* Solution Block */}
      {showSolution && (
        <div className="solution-box fade-in">
          <div className="solution-header">
            <span className="code-icon">&lt;/&gt;</span>
            <div className="solution-title">Solution</div>
          </div>
          <pre className="code-block">
            <code>{data.solution}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProblemCardBookmark;
