import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import LoginPage from "./components/Login/LoginPage";
import SignupPage from "./components/Signup/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import Problems from "./components/Problems/Problems";
import MyBookmarks from "./components/MyBookmarks/MyBookmarks";
import Folder from "./components/MyBookmarks/Folder";
import Calendar from "./components/Calendar/Calendar";
import Profile from "./components/Profile/Profile";
import ChatHistory from "./components/ChatHistory/ChatHistory";
import Chat from "./components/Chat/Chat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfile from "./components/Profile/UserProfile";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mybookmarks"
          element={
            <ProtectedRoute>
              <MyBookmarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/folders/:id"
          element={
            <ProtectedRoute>
              <Folder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chathistory"
          element={
            <ProtectedRoute>
              <ChatHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Public profile pages (username or 'me' for current user) */}
        <Route path="/profile/:username" element={<UserProfile />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ToastContainer
        position="top-right"
        theme="light"
        hideProgressBar
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}
