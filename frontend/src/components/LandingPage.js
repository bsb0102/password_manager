import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Redirect to the /login route
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Redirect to the /redirect route
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        {/* <div className="nav-brand" onClick={() => navigate('/')}>
          TECH CJ
        </div> */}
        <div>
          <button onClick={handleLoginClick} className="nav-login-btn">
            Login
          </button>
          <button onClick={handleRegisterClick} className="nav-signup-btn">
            Sign Up
          </button>
        </div>
      </nav>
      {/* <header className="landing-header">
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
      </footer> */}
    </div>
  );
};

export default LandingPage;
