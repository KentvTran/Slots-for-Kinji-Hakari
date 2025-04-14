import React, { useState } from "react";
import "./ResetPassword.scss";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase/firebase"; // adjust path if needed
import { useSearchParams, useNavigate } from "react-router-dom";

const isPasswordValid = (pwd) => {
  return (
    pwd.length >= 8 &&
    /[!@#$%^&*(),.?":{}|<>]/.test(pwd) &&
    /\d/.test(pwd)
  );
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const oobCode = searchParams.get("oobCode"); // Firebase provides this in reset link

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isPasswordValid(password)) {
      setError("Password does not meet complexity requirements.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Password has been reset successfully!");
      setTimeout(() => navigate("/login-page"), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2 className="title">Reset Password</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form className="reset-password-form" onSubmit={handleSubmit}>
          <label className="label">New Password</label>
          <input
            type="password"
            className="input"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isPasswordValid(password) && password.length > 0 && (
            <p className="password-hint">
              Password must be at least **8 characters**, contain a **special character**, and at least **one number**.
            </p>
          )}

          <label className="label">Repeat New Password</label>
          <input
            type="password"
            className="input"
            placeholder="Repeat new password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
          {repeatPassword && password !== repeatPassword && (
            <p className="password-hint">Passwords do not match.</p>
          )}

          <button
            type="submit"
            className={`submit-btn ${!password || !repeatPassword ? "disabled" : ""}`}
            disabled={!password || !repeatPassword}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
