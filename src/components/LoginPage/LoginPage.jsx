import React, { useState } from 'react';
import './LoginPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { useAuth } from '../../contexts/authContext';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { differenceInDays } from 'date-fns';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const updateDailyLoginReward = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    let userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    let data = userSnap.data();

    const updates = {};
    if (!('credits' in data)) updates.credits = 0;
    if (!('loginStreak' in data)) updates.loginStreak = 0;
    if (!('lastLogin' in data)) updates.lastLogin = null;

    if (Object.keys(updates).length > 0) {
      await updateDoc(userRef, updates);
      userSnap = await getDoc(userRef);
      data = userSnap.data();
    }

    const lastLogin = data.lastLogin?.toDate?.() || null;
    const today = new Date();
    const streak = data.loginStreak || 0;
    const credits = data.credits || 0;

    let newStreak = 1;
    let reward = 200;

    if (lastLogin) {
      const daysPassed = differenceInDays(today, lastLogin);
      if (daysPassed === 1) {
        newStreak = streak + 1;
        reward = 200 + 50 * (newStreak - 1);
      } else if (daysPassed === 0) {
        return; // already rewarded today
      }
    }

    await updateDoc(userRef, {
      credits: credits + reward,
      loginStreak: newStreak,
      lastLogin: serverTimestamp()
    });

    console.log(`🏆 Daily login reward: +${reward} credits (streak: ${newStreak})`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await doSignInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await updateDailyLoginReward(user); // ✅ login streak logic

      setUser(user);
      navigate('/slots');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="actions">
            <button type="submit">Login</button>
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>

          <p className="signup-link">
            Don't have an account? <Link to="/new-account">Create New</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
