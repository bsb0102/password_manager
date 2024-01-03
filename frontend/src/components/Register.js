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
  const [isSlideIn, setIsSlideIn] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    console.log('isSlideIn:', isSlideIn);
    const slideInTimeout = setTimeout(() => {
      setIsSlideIn(true);
      console.log('isSlideIn (after timeout):', isSlideIn);
    }, 1000);
    return () => clearTimeout(slideInTimeout);

    // Fetch the CSRF token and store it in a state variable
    getCsrfToken()
      .then((token) => {
        setCsrfToken(token);
      })
      .catch((error) => {
        console.error('Failed to fetch CSRF token for Register:', error);
      });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      console.log('Submitting registration form...');
      const response = await axiosInstance.post(
        '/api/register',
        {
          username,
          password,
        },
        {
          headers: {
            'X-CSRF-Token': csrfToken, // Use the CSRF token in the headers
          },
        }
      );
      console.log('Registration response:', response.data);

      setSuccessMessage('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.log('Registration error:', error);
    }
  };

  return (
    <div className="auth-form-container animated-bg">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Register</h2>
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
