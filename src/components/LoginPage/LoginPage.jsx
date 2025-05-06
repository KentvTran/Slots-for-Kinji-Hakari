import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { differenceInDays } from 'date-fns';
import './LoginPage.scss';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const updateDailyLoginReward = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    let userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) return;
  
    let data = userSnap.data();
  
    // ✅ Patch missing fields
    const updates = {};
    if (!('credits' in data)) updates.credits = 0;
    if (!('loginStreak' in data)) updates.loginStreak = 0;
    if (!('lastLogin' in data)) updates.lastLogin = null;
  
    if (Object.keys(updates).length > 0) {
      await updateDoc(userRef, updates);
      userSnap = await getDoc(userRef); // re-fetch after patch
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
    try {
      const userCredential = await doSignInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await updateDailyLoginReward(user); // ✅ Reward logic

      setUser(user);
      navigate('/slots');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
