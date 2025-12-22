import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signup } from "../../api/api"; // Import from your api.js
import "../../App.css";
import "./SignupPage.css";
import Navbar from "../Home/Navbar";
import Footer from "../Dashboard/Footer/Footer";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
     const { data } = await signup(formData);
       localStorage.setItem("token", data.token);
       localStorage.setItem("user", JSON.stringify(data.user));
       if (window.chrome?.storage) {
         chrome.storage.local.set({
           codekeeper_token: data.token,
         });
       }
      navigate("/dashboard"); // Redirect to login on success
      toast.success("Signed Up successfully!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
    finally {
       setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth-wrapper">
        <div className="glass-card">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join the CodeKeeper community</p>

          {error && (
            <p
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="e.g. AlgoMaster"
                onChange={handleChange}
                required
              />
            </div>
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
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : "Sign Up"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
