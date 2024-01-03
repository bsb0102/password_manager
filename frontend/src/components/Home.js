import React from 'react';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

function Home() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <h2>Welcome, John Doe!</h2>
        <h3>Home Content Goes Here</h3>
      </div>
    </div>
  );
}

export default Home;
