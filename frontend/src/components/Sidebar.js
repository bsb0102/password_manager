import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const excludedRoutes = ['/home', '/', '/features'];
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const shouldDisplaySidebar = !excludedRoutes.includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <div
        className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}
        style={{ width: isSidebarOpen ? '280px' : '0' }}
      >
        <div className="sidebar-logged-in">
          <p>Logged in as:</p>
          <p>John Doe</p>
        </div>
        <div className="sidebar-options">
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
            Settings
          </Link>
        </div>
        <div className="logout-button">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
    </>
  );
}

export default Sidebar;
