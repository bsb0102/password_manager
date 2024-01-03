import React from 'react';
import PasswordManager from './PasswordManager'; // Adjust the path according to your file structure
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router';

const Dashboard = () => {

  navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage or sessionStorage
    localStorage.removeItem('token');

    // Redirect to the login page or home page
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {/* Other dashboard components or features can be added here */}
      
      <PasswordManager /> {/* This is where the PasswordManager component is included */}
    </div>
  );
};

export default Dashboard;
