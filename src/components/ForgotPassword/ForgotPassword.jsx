import React from "react";
import "./ForgotPassword.scss";

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="title">Forgot Password</h2>
        <p className="subtitle">
          Enter your email to reset your password.
        </p>

        <form className="forgot-password-form">
          <label className="label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="input"
          />

          <button
            type="submit"
            className="submit-btn"
          >
            Submit
          </button>
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
