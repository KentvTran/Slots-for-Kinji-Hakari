import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.scss";

const WelcomePage = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  return (
    <div className="welcome-page">
      <div className="content-box">
        <h1>Hakari Spin-jitsu</h1>
        <button className="login-button" onClick={() => navigate("/login-page")}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
