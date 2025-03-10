import React, { useState } from 'react';
import './LoginPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { useAuth } from '../../contexts/authContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await doSignInWithEmailAndPassword(email, password);
      setUser(userCredential.user);
      navigate('/slots'); // Redirect to home after login
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
