import { io } from "socket.io-client";

let socket = null;

export const initSocket = (userId) => {
  if (socket) return socket;
  socket = io(process.env.REACT_APP_BACKEND_URL, {
    transports: ["websocket"],
    withCredentials: true,
  });

  socket.on("connect", () => {
    if (userId) socket.emit("join", { userId });
  });

  return socket;
};

export const joinRoom = (roomId) => {
  if (!socket) return;
  socket.emit("joinRoom", { roomId });
};

export const sendMessage = (payload) => {
  if (!socket) return;
  socket.emit("send_message", payload);
};

export const markMessagesSeen = ({ senderId, receiverId }) => {
  if (!socket) return;
  socket.emit("messages_seen", { senderId, receiverId });
};

export const onEvent = (event, cb) => {
  if (!socket) return;
  socket.on(event, cb);
};

export const offEvent = (event, cb) => {
  if (!socket) return;
  socket.off(event, cb);
};

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};
