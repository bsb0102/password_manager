import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); // Use the useNavigate hook

  const excludedRoutes = ['/home']; // Add any routes to exclude here

  const shouldDisplaySidebar = !excludedRoutes.includes(location.pathname);


  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Navigate to the login page
    navigate('/login');
  };

  return (
    shouldDisplaySidebar && (
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Your App</h1>
        </div>
        <div className="sidebar-options">
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
            Settings
          </Link>
        </div>
        <div className="sidebar-user">
          <p>Logged in as:</p>
          <p>John Doe</p>
        </div>
        <div className="logout-button">
          <button onClick={handleLogout} className="logout-button-red">
            Logout
          </button>
        </div>
      </div>
    )
  );
}

export default Sidebar;
