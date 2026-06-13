import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/grocify-icon.svg';
import './Style.css';

function Navbar({ isAuthenticated, onLogout, currentUser }) {
  return (
    <div className="nav">
      <div className="nav-left">
        <img className="logo-icon" src={logo} alt="Grocify logo" />
        <div className="nav-title-group">
          <h2>Monthly Grocery Planning App</h2>
          <p className="nav-subtitle">Organize your grocery shopping for the month.</p>
        </div>
      </div>
      <div className="nav-right">
        {isAuthenticated ? (
          <div className="nav-user-block">
            <span className="nav-user">Hi, {currentUser || 'Grocifier'}</span>
            <span className="nav-status">You are logged in</span>
            <Link className="nav-link" to="/profile">
              Profile
            </Link>
            <button className="nav-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="nav-action-block">
            <Link className="nav-link" to="/login">
              Login
            </Link>
            <Link className="nav-link" to="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
