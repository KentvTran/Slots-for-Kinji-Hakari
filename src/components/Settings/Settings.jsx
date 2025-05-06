import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth"; 
import { useNavigate } from "react-router-dom";
import "./Settings.scss";

const Settings = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  
  const navigate = useNavigate();

  //fetch user settings from Firestore
  const fetchUserSettings = async () => {
    if (!user?.uid) return;
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(user.email); // From auth
      setDarkMode(data.darkMode || false);
    } else {
      setEmail(user.email); // New user with no Firestore data yet
    }
  };
  
  useEffect(() => {
    fetchUserSettings();
  }, [user]);

  // Update dark mode class on body or root div
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleSave = async () => {
    if (!user?.uid) return;
    const userRef = doc(db, "users", user.uid);
    const updatedSettings = {
      firstName,
      lastName,
      email,
      darkMode,
    };
    try {
      await setDoc(userRef, updatedSettings, { merge: true });
      alert(`Settings saved:\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nDark Mode: ${darkMode ? "On" : "Off"}`);
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings.");
    }
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase signOut function
      navigate("/"); // Redirect to login page after logout
    } catch (err) {
      console.error("Error during logout:", err);
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
                user?.email?.charAt(0).toUpperCase()
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
            Current Password:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>

          <label>
            New Password:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>


        </div>

        {/* Save Button */}
        <button onClick={handleSave} className="save-button">
          Save Changes
        </button>

        {/* Logout Button */}
        <button onClick={handleLogout} className="signout-button">
          Logout
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
