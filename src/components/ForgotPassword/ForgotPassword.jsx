import React, { useState } from "react";
import "./ForgotPassword.scss";
import { doPasswordReset } from "../../firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await doPasswordReset(email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="title">Forgot Password</h2>
        <p className="subtitle">Enter your email to reset your password.</p>

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <label className="label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="submit-btn">
            Submit
          </button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>

        <div className="back-to-login">
          <a href="/login-page" className="login-link">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
