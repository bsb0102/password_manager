import React from 'react';
import '../../styles/Dashboard.css';



const Dashboard = () => {
  // Placeholder data for stats, replace with actual data fetching logic
  const stats = {
    totalUsers: 150,
    activeUsers: 75,
    userGrowth: '14%',
    averageSessionTime: '5 minutes'
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-container">
        <div className="stat-item">
          <h2>Total Users</h2>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-item">
          <h2>Active Users</h2>
          <p>{stats.activeUsers}</p>
        </div>
        <div className="stat-item">
          <h2>User Growth</h2>
          <p>{stats.userGrowth}</p>
        </div>
        <div className="stat-item">
          <h2>Average Session Time</h2>
          <p>{stats.averageSessionTime}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
