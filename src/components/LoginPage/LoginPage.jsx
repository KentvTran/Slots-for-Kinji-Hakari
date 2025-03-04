import React from 'react';
import './LoginPage.scss';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>

          <div className="actions">
            <button type="submit">Login</button>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <p className="signup-link">
            Don't have an account? <a href="#">Create new</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
