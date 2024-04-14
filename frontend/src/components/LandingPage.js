import React from 'react';
import { Link } from 'react-router-dom';
import "./LandingPage.css"

// Header Component
const Header = () => {
  return (
    <div className="sk-header">
      <div className="sk-container">
        <div className="sk-navbar">
          <div className="sk-logo">
            <Link to="/"><img src="./images/logo.png" alt="SafeKey Logo" width="125" /></Link>
          </div>
          <nav>
            <ul className="sk-menu-items">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </nav>
          <img src="./images/menu.png" onClick={() => {}} alt="Menu" className="sk-menu-icon" />
        </div>
        <div className="sk-row">
          <div className="sk-col-2">
            <h1>Welcome to<br />SafeKey!</h1>
            <p>Secure and manage your passwords effectively with our easy-to-use interface.</p>
            <Link to="/login" className="sk-btn">Start Now</Link>
          </div>
          <div className="sk-col-2">
            <img src="./images/image1.png" alt="Main Product" />
          </div>
        </div>      
      </div>
    </div>
  );
}

// Categories Component
const Categories = () => {
  return (
    <div className="sk-categories">
      <div className="sk-small-container">
        <div className="sk-row">
          <div className="sk-col-3">
            <img src="./images/cat1.jpg" alt="Our Mission" />
            <h3>Our Mission</h3>
            <p>We want to make it easy for users to securely access their sensitive information by providing a reliable, secure, easy-to-use password management program.</p>
          </div>
          <div className="sk-col-3">
            <img src="images/cat2.jpg" alt="Our Approach" />
            <h3>Our Approach</h3>
            <p>SafeKey protects your data using AES-256, SHA-256 and IV encryption. You are the only person who can decrypt your information!</p>
          </div>
          <div className="sk-col-3">
            <img src="images/cat3.png" alt="Our Commitment" />
            <h3>Our Commitment</h3>
            <p>Your master password and stored passwords are kept secret, even from SafeKey. Your information is encrypted and decrypted only at device level.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Testimonials Component
const Testimonials = () => {
  return (
    <div className="sk-testimonial">
      <div className="sk-small-container">
        <h2 className="sk-title">Our Testimonials</h2>
        <div className="sk-row">
          {/* Additional testimonials can follow similar structure */}
        </div>
      </div>
    </div>
  );
}

// SpecialOffer Component
const SpecialOffer = () => {
  return (
    <div className="sk-offer">
      <div className="sk-small-container">
        <div className="sk-row">
          <div className="sk-col-2">
            <img src="/images/exclusive.png" alt="Exclusive" className="sk-offer-img" />
          </div>
          <div className="sk-col-2">
            <h2>Available on SafeKey</h2>
            <h1>Password Generation</h1>
            <small>Generate secure and strong passwords for any site!</small>
            <br />
            <Link to="/login" className="sk-btn">Start Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Footer Component
const Footer = () => {
  return (
    <div className="sk-footer">
      <div className="sk-container">
        <div className="sk-row">
          <div className="sk-footer-col2">
            <img src="images/logo.png" alt="SafeKey Logo" />
            <p>Begin your journey of secure data today.</p>
          </div>
          <div className="sk-footer-col3">
            <h3>Useful Links</h3>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>
          <div className="sk-footer-col4">
            <h3>Follow Us</h3>
            <ul>
              <li>Twitter</li>
              <li>Instagram</li>
              <li>Facebook</li>
            </ul>
          </div>
        </div>
        <hr />
        <p className="sk copyright"><Link to="/login">Copyright 2023 - SafeKey</Link></p>
      </div>
    </div>
  );
}

// Main LandingPage Component that includes all subcomponents
const LandingPage = () => {
  return (
    <div>
      <Header />
      <Categories />
      <Testimonials />
      <SpecialOffer />
      <Footer />
    </div>
  );
}

export default LandingPage;
