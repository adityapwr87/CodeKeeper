import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../api/api"; // Import from your api.js
import "../../App.css";
import "./LoginPage.css";
import Navbar from "../Home/Navbar";
import Footer from "../Dashboard/Footer/Footer";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      // Save token (adjust based on your actual response structure)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard"); // Redirect to Home or Dashboard
      toast.success("Logged In successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth-wrapper">
        <div className="glass-card">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Continue your revision streak</p>

          {error && (
            <p
              style={{
                color: "#ef4444",
                textAlign: "center",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group password-group">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Login
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
