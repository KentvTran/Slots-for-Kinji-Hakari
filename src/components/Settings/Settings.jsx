import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import "./Settings.scss";

const Settings = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePic, setProfilePic] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Update dark mode class on body or root div
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleSave = () => {
    console.log("Settings saved:", { firstName, lastName, email, darkMode });
    alert(`Settings saved:\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nDark Mode: ${darkMode ? "On" : "Off"}`);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-box">
        <h1>Settings</h1>

        {/* Profile Section */}
        <div className="user-info">
          <div className="profile-section">
            <label htmlFor="profile-upload" className="avatar">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="avatar-img" />
              ) : (
                user?.firstName?.charAt(0).toUpperCase()
              )}
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Account Info */}
        <div className="account-info">
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>

          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        {/* Save Button */}
        <button onClick={handleSave} className="save-button">
          Save Changes
        </button>

        {/* Dark Mode Slider */}
        <div className="dark-mode-toggle">
          <span>Dark Mode</span>
          <label className="slider-container">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="slider-input"
            />
            <span className="slider"></span>
          </label>
        </div>

       
      </div>
    </div>
  );
};

export default Settings;
