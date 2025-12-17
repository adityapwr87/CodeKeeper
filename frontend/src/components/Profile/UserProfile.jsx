import React, { useEffect, useState } from "react";
import "./Profile.css";
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";
import {
  FaEnvelope,
  FaUniversity,
  FaMapMarkerAlt,
  FaCode,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  SiCodeforces,
  SiLeetcode,
  SiGeeksforgeeks,
  SiCodechef,
} from "react-icons/si";
import { FiExternalLink } from "react-icons/fi";
// Import your API methods
import { getProfileByUsername } from "../../api/api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const navigate = useNavigate();

  const getPlatformConfig = (platformName) => {
    const lower = platformName?.toLowerCase();
    switch (lower) {
      case "codeforces":
        return { icon: <SiCodeforces />, color: "#1f8acb" };
      case "leetcode":
        return { icon: <SiLeetcode />, color: "#ffa116" };
      case "codechef":
        return { icon: <SiCodechef />, color: "#5b4638" };
      case "atcoder":
        return { icon: <FaCode />, color: "#fff" };
      case "geeksforgeeks":
        return { icon: <SiGeeksforgeeks />, color: "#2f8d46" };
      default:
        return { icon: <FiExternalLink />, color: "#fff" };
    }
  };
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!currentUser || !token) return navigate("/login");
    const fetchProfile = async () => {
      try {
        const res = await getProfileByUsername(username);
        setUser(res.data.user || res.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

 const handleUserClick = (user) => {
   // We pass the user object in 'state' so the Chat page doesn't have to fetch it again
   if (!currentUser || !token) return navigate("/login");
   console.log("Starting chat with user:", user);
   console.log("Starting chat with user:", user._id);
   navigate(`/chat/${user._id}`, { state: { currentUser, receiverUser: user } });
 };

  if (loading) return <div className="loading-screen">Loading Profile...</div>;
  if (!user) return <div className="error-screen">User not found</div>;

  return (
    <div>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-container">
          {/* --- LEFT SIDEBAR --- */}
          <div className="profile-sidebar">
            <div className="avatar-section">
              <div className="avatar-ring">
                <img
                  src={user.profileImage || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="avatar-img"
                />
              </div>
              <h2 className="user-name">{user.name || "User Name"}</h2>
              <p className="user-handle">@{user.username}</p>
            </div>

            <div className="profile-details">
              <h3 className="section-label">
                <span role="img" aria-label="doc">
                  📋
                </span>{" "}
                Profile Details
              </h3>
              <div className="detail-item">
                <FaUniversity className="detail-icon" />
                <span>{user.college || "Add College"}</span>
              </div>
              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <span>{user.city || "Add City"}</span>
              </div>
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <span className="email-text">{user.email}</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT MAIN CONTENT --- */}
          <div className="profile-content">
            {/* About Me */}
            <section className="info-section">
              <div className="start-chat">
                <h3 className="section-title">💫 About Me</h3>
                <button
                  onClick={() => handleUserClick(user)}
                  className="btn-primary start-chat-btn"
                >
                  Start chat
                </button>
              </div>

              <div className="info-card">
                <p>{user.bio || "No bio added yet."}</p>
              </div>
            </section>

            {/* Coding Platforms */}
            <section className="info-section">
              <h3 className="section-title">🔗 Coding Platforms</h3>
              <div className="platforms-grid">
                {user.handles && user.handles.length > 0 ? (
                  user.handles.map((handleObj, index) => {
                    const config = getPlatformConfig(handleObj.platform);
                    return (
                      <a
                        key={index}
                        href={handleObj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="platform-card"
                      >
                        <div
                          className="platform-icon"
                          style={{ color: config.color }}
                        >
                          {config.icon}
                        </div>
                        <span className="platform-name">
                          {handleObj.platform}
                        </span>
                        <FiExternalLink className="link-icon" />
                      </a>
                    );
                  })
                ) : (
                  <p className="empty-msg">No handles added yet.</p>
                )}
              </div>
            </section>

            {/* Skills */}
            <section className="info-section">
              <h3 className="section-title">🚀 Skills</h3>
              <div className="skills-container">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="empty-msg">No skills added.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
