// frontend/src/components/LandingPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/LandingPage.css'; // Ensure the CSS file path is correct

const LandingPage = () => {
const navigate = useNavigate();
const [isModalOpen, setIsModalOpen] = useState(false);

const openLoginModal = () => {
    setIsModalOpen(true); // Open the modal
};

const closeLoginModal = () => {
    setIsModalOpen(false); // Close the modal
};

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-brand" onClick={() => navigate('/')}>TECH CJ</div>
        <button onClick={() => navigate('/login')} className="nav-login-btn">Login</button>
      </nav>
      <header className="landing-header">
        <h1>Innovative solutions for modern problems</h1>
      </header>
      <main className="landing-main">
        <section className="landing-info">
          <h2>About Our Product</h2>
          <p>Describe your product in more detail, its benefits, and how it solves problems.</p>
          <button onClick={() => navigate('/features')} className="features-btn">
            Learn More
          </button>
          {/* Add more content as needed */}
        </section>
      </main>
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} TECH CJ</p>
      </footer>
    </div>
  );
  
};

export default LandingPage;
