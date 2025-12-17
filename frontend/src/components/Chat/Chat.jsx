import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getChatMessages, getUserById } from "../../api/api";
import { socketref as socket } from "../../socket";
import { IoSend, IoArrowBack } from "react-icons/io5";
import { BsCheck2All } from "react-icons/bs";
import Navbar from "../Dashboard/Navbar/Navbar";
import "./Chat.css";

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const bottomRef = useRef(null);

  // 1. Get Current User (Sender)
  const [currentUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  // 2. Initialize Receiver: Priority to location.state, else null
  const [receiver, setReceiver] = useState(location.state?.user || null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(!receiver); // Only load if we don't have receiver yet

  // --- Effect 1: Auth Check ---
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  // --- Effect 2: Fetch Receiver ONLY if missing (Page Refresh) ---
  useEffect(() => {
    // If we already have receiver from state, skip this API call
    if (receiver) return;

    if (!id) return;

    const fetchReceiverData = async () => {
      try {
        setLoading(true);
        console.log("Fetching receiver from API for ID:", id);
        const res = await getUserById(id);
        const userData = res.data.user || res.data;
        setReceiver(userData);
      } catch (error) {
        console.error("Error fetching receiver:", error);
        navigate("/chat-history");
      } finally {
        setLoading(false);
      }
    };

    fetchReceiverData();
  }, [id, receiver, navigate]);

  useEffect(() => {
    if (!currentUser?._id || !receiver?._id) return;

    const roomId = [currentUser._id, receiver._id].sort().join("-");

    // 1. Join Rooms
    socket.emit("join", { userId: currentUser._id });
    socket.emit("joinRoom", { roomId });

    // 2. Load Old Messages & Mark Unread as Seen
    const fetchHistory = async () => {
      try {
        const res = await getChatMessages(currentUser._id, receiver._id);
        setMessages(res.data);

        // Check if there are any unread messages from the OTHER person
        const unreadFromThem = res.data.some(
          (msg) => msg.sender === receiver._id && !msg.seen
        );

        // If yes, tell backend: "I (currentUser) saw messages from (receiver)"
        if (unreadFromThem) {
          socket.emit("messages_seen", {
            senderId: receiver._id, // The person who sent the message
            receiverId: currentUser._id, // Me (I am reading it)
          });
        }

        scrollToBottom();
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };

    fetchHistory();

    // 3. Listener: Receiving a new message
  const handleReceiveMessage = (data) => {
    // Verify message belongs to this chat
    if (
      (data.sender === receiver._id && data.receiver === currentUser._id) ||
      (data.sender === currentUser._id && data.receiver === receiver._id)
    ) {
      // CASE 1: The OTHER person sent the message (Incoming)
      if (data.sender === receiver._id) {
        // 1. Update UI
        setMessages((prev) => [...prev, { ...data, seen: true }]);

        // 2. Tell Backend "I saw this"
        socket.emit("messages_seen", {
          senderId: receiver._id,
          receiverId: currentUser._id,
        });

        scrollToBottom();
      }
    }
  };

    const handleSeenStatus = (data) => {
      if (data.receiverId === receiver._id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === currentUser._id ? { ...msg, seen: true } : msg
          )
        );
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("messages_seen_by_receiver", handleSeenStatus);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_seen_by_receiver", handleSeenStatus);
      socket.emit("leaveRoom", { roomId });
    };
  }, [currentUser, receiver]);
  // --- Helper Functions ---

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !receiver) return;

    const roomId = [currentUser._id, receiver._id].sort().join("-");
    console.log("Sending message:", newMessage, "to room:", roomId);

    const msgData = {
      sender: currentUser._id,
      receiver: receiver._id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      roomId,
    };
    console.log("Message data prepared:", msgData);

    // Optimistic Update
    setMessages((prev) => [...prev, msgData]);
    socket.emit("send_message", msgData);
    setNewMessage("");
    scrollToBottom();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // --- Render ---

  if (loading) return <div className="chat-loading">Loading Chat...</div>;

  return (
    <div>
      <Navbar/>
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <IoArrowBack />
          </button>

          <div className="header-user-info" onClick={() => navigate(`/profile/${receiver.username}`,{ state: { user: receiver } })}>
            <div className="avatar-wrapper">
              {receiver?.profileImage ? (
                <img
                  src={receiver.profileImage}
                  alt={receiver.username}
                  className="header-avatar"
                />
              ) : (
                <div className="header-avatar-placeholder">
                  {receiver?.username?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="online-dot"></span>
            </div>
            <div className="user-details">
              <h3>{receiver?.username || "User"}</h3>
              <span className="status-text">Active Now</span>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="messages-area">
          {messages.map((msg, index) => {
            const isMyMessage = msg.sender === currentUser._id;
            return (
              <div
                key={index}
                className={`message-row ${
                  isMyMessage ? "my-message" : "their-message"
                }`}
              >
                <div className="bubble">
                  <p className="message-text">{msg.content}</p>
                  <div className="message-meta">
                    <span className="time">{formatTime(msg.timestamp)}</span>

                    {/* Only show ticks for MY messages */}
                    {isMyMessage && (
                      <BsCheck2All
                        className={`read-receipt ${msg.seen ? "seen" : ""}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className="send-btn" onClick={handleSendMessage}>
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
