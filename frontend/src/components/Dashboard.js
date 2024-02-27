import React from 'react';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <h2>Welcome, John Doe!</h2>
        <h3>Dashboard Content Goes Here</h3>
      </div>
    </div>
  );
}

export default Dashboard;
