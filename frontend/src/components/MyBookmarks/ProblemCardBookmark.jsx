import React, { useState } from "react";
import { FiTrash2, FiExternalLink, FiCode } from "react-icons/fi";

const ProblemCardBookmark = ({ data, onRemove, isRemoving }) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="problem-card bookmark-card">
      {/* Card Top */}
      <div className="card-top">
        <h3 className="prob-title">{data.title}</h3>

        <button
          className="btn-icon"
          onClick={() => onRemove(data._id)}
          disabled={isRemoving}
        >
          <FiTrash2 />
        </button>
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

      {/* Actions */}
      {data.solution && (
        <div className="card-actions">
          <button
            className={`btn-green ${showSolution ? "active" : ""}`}
            onClick={() => setShowSolution(!showSolution)}
          >
            <FiCode /> {showSolution ? "Hide Solution" : "Show Solution"}
          </button>
        </div>
      )}

      {/* Solution */}
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
