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
    const { setUser } = useAuth();  // ✅ Ensure useAuth() returns setUser
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const userCredential = await doCreateUserWithEmailAndPassword(email, password);
            setUser(userCredential.user); // ✅ Now setUser should work
            navigate("/"); // Redirect to home after sign-up
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
                            onChange={(e) => setEmail(e.target.value)}
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
                    </div>

                    <button type="submit" className="submit-btn">
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
