import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../modals/Modals.jsx'; // Import your modal component
import '../../styles/LandingPage.css'; // Ensure the CSS file path is correct

const LandingPage = () => {
  const navigate = useNavigate();

  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openLoginModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeLoginModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle the login button click
  const handleLoginClick = () => {
    openLoginModal();
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-brand" onClick={() => navigate('/')}>
          TECH CJ
        </div>
        <button onClick={handleLoginClick} className="nav-login-btn">
          Login
        </button>
      </nav>
      <header className="landing-header">
        <h1>Innovative solutions for modern problems</h1>
      </header>
      <main className="landing-main">
        <section className="landing-info">
          <h2>About Our Product</h2>
          <p>
            Describe your product in more detail, its benefits, and how it
            solves problems.
          </p>
          <button onClick={() => navigate('/features')} className="features-btn">
            Learn More
          </button>
        </section>
      </main>
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} TECH CJ</p>
      </footer>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default LandingPage;
