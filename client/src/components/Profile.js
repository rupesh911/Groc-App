import React from 'react';
import { getUserEmail, getUserName } from '../services/authService';
import './Style.css';

const Profile = ({ onLogout }) => {
  const name = getUserName();
  const email = getUserEmail();

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Your Profile</h2>
        <p className="profile-note">Manage your Grocify account and return to your grocery plan anytime.</p>
        <div className="profile-row">
          <span>Name</span>
          <strong>{name || 'No name provided'}</strong>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <strong>{email || 'Not signed in'}</strong>
        </div>
        <button className="profile-logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
