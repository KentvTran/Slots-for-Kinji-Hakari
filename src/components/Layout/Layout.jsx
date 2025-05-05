import React from 'react';
import { FaGamepad } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaTrophy } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import './Layout.scss';

const Layout = ({ children }) => {
  const { user } = useAuth();
 
  return (
    <div className="layout">
      <nav className="top-nav">
        <div className="icon">
          <Link to="/slots">
            <FaGamepad />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/shop">Shop</Link>
          <Link to="/trade">Trade</Link>
          <Link to="/leaderboards">
            <FaTrophy />
          </Link>
          
          <Link to={user ? "/settings" : "/login-page"}> 
            <CgProfile />
          </Link>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
