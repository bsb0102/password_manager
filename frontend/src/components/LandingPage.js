import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../modals/Modals.jsx';
import Login from '../components/Login.js';
import Register from '../components/Register.js'; // Import the Register component
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-brand" onClick={() => navigate('/')}>
          TECH CJ
        </div>
        <Link to="/login" className="nav-login-btn">
          Login
        </Link>
        <button onClick={() => setIsRegisterModalOpen(true)} className="nav-signup-btn">
          Sign Up
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

      {/* Conditionally render the login and registration forms within modals */}
      {isLoginModalOpen && (
        <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
          <Login />
        </Modal>
      )}
      {isRegisterModalOpen && (
        <Modal isOpen={isRegisterModalOpen} onClose={closeRegisterModal}>
          <Register />
        </Modal>
      )}
    </div>
  );
};

export default LandingPage;
