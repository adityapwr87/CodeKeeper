import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import UserProfile from "./components/Profile/UserProfile";
import ChatHistory from "./components/ChatHistory/ChatHistory";
import Chat from "./components/Chat/Chat";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- ROOT ---------- */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Home />}
        />

        {/* ---------- AUTH ROUTES ---------- */}
        <Route
          path="/login"
          element={
           <LoginPage />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage />
          }
        />

        {/* ---------- PROTECTED ROUTES ---------- */}
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
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
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

        {/* ---------- PUBLIC PROFILE ---------- */}
        <Route path="/profile/:username" element={<UserProfile />} />

        {/* ---------- FALLBACK ---------- */}
        <Route
          path="*"
          element={
            <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
          }
        />
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
