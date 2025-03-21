import React, { useState } from "react";
import "./NewAccount.scss";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

const NewAccount = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState(null);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    // Function to check if the email is valid
    const isEmailValid = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    // Function to check password requirements (8+ chars, special symbol, number)
    const isPasswordValid = (pwd) => {
        return (
            pwd.length >= 8 &&
            /[!@#$%^&*(),.?":{}|<>]/.test(pwd) &&  // Must contain a special character
            /\d/.test(pwd)                         // Must contain a number (0-9)
        );
    };

    // Check if form is valid
    const isFormValid = 
        isEmailValid(email) &&
        isPasswordValid(password) &&
        password === repeatPassword;

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!isEmailValid(e.target.value)) {
            e.target.setCustomValidity("Please enter a valid email address.");
        } else {
            e.target.setCustomValidity(""); // Reset validation message
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return; // Prevents invalid submission
        try {
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);
            setUser(userCredential.user);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="new-account-container">
            <div className="new-account-box">
                <h2 className="title">Create Account</h2>
                {error && <p className="error-message">{error}</p>}
                <form className="new-account-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {!isPasswordValid(password) && password.length > 0 && (
                            <p className="password-hint">
                                Password must be at least **8 characters** long, contain a **special symbol**, and at least **one number**.
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="label">Repeat Password</label>
                        <input
                            type="password"
                            placeholder="Repeat your password"
                            className="input"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                        {repeatPassword.length > 0 && password !== repeatPassword && (
                            <p className="password-hint">Passwords do not match.</p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className={`submit-btn ${!isFormValid ? "disabled" : ""}`} 
                        disabled={!isFormValid}
                    >
                        Sign Up
                    </button>
                </form>

                <div className="login-link-container">
                    <a href="/login-page" className="login-link">
                        Already have an account? Log in
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NewAccount;
