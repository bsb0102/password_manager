import React from 'react';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

function Settings() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <h2>Welcome to Settings!</h2>
        <div>
          <h3>Settings Options:</h3>
          <ul>
            <li>Change Username</li>
            <li>Change Password</li>
            <li>Add Payment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Settings;
