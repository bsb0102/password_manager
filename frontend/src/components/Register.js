import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/api.js'; // Import axiosInstance
import { getCsrfToken } from '../utils/csrfUtils';
import '../styles/AuthForm.css'; // Unified CSS for both login and register
const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // State to store the CSRF token

  useEffect(() => {
    // Fetch the CSRF token from the server and set it in state
    fetch('/api/csrf-token')
      .then((response) => response.json())
      .then((data) => {
        setCsrfToken(data.csrfToken);
      })
      .catch((error) => {
        console.error('Failed to fetch CSRF token:', error);
      });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    // Include the CSRF token in the form data
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('_csrf', csrfToken);

    // Send the POST request with the CSRF token included
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Handle successful registration
        setSuccessMessage('Registration successful');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Internal server error');
    }
  };

  return (
    <div className="auth-form-container animated-bg">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Register</h2>
        <input type="hidden" name="_csrf" value={csrfToken} />
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <p className="alt-action">
          Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
