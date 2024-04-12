import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Stellen Sie sicher, dass der Pfad korrekt ist

function LandingPage() {
  return (
    <div className="secure-pass-app">
      <header>
        <nav className="secure-pass-nav">
          <ul className="secure-pass-nav-links">
            <li><Link to="/login"><button className="secure-pass-button">Login</button></Link></li>
            <li><Link to="/register"><button className="secure-pass-button">Register</button></Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="secure-pass-intro">
          <h1>Welcome to SecurePass Manager</h1>
          <p>Secure and manage your passwords effectively with our easy-to-use interface.</p>
          <Link to="/register"><button className="secure-pass-button">Get Started</button></Link>
        </section>
        <section className="secure-pass-features">
          <div className="secure-pass-feature">
            <h2>Multi Factor Authentication</h2>
            <p>Enhance your account security with additional verification steps.</p>
          </div>
          <div className="secure-pass-feature">
            <h2>Password Storing with Encryption</h2>
            <p>Store your passwords securely with end-to-end encryption.</p>
          </div>
          <div className="secure-pass-feature">
            <h2>Secure Notes</h2>
            <p>Keep your sensitive information safe in encrypted notes.</p>
          </div>
        </section>
      </main>
      <footer className="secure-pass-footer">
        <p>© 2024 SecurePass. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
