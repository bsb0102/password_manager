import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/api.js'; // Import axiosInstance
import '../styles/AuthForm.css'; // Unified CSS for both login and register

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSlideIn, setIsSlideIn] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Trigger the slide-in animation after a delay (e.g., 1000 milliseconds)
    console.log('isSlideIn:', isSlideIn); // Add this line for debugging
    const slideInTimeout = setTimeout(() => {
      setIsSlideIn(true);
      console.log('isSlideIn (after timeout):', isSlideIn); // Add this line for debugging
    }, 1000);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(slideInTimeout);

    // Fetch the CSRF token from your server and store it in state
    axiosInstance
      .get('/api/csrf-token')
      .then((response) => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error('Error fetching CSRF token:', error);
      });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      console.log('Submitting registration form...'); // Add a console log for debugging
      const response = await axiosInstance.post(
        '/api/register',
        {
          username,
          password,
        },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        }
      );
      console.log('Registration response:', response.data); // Add a console log for debugging

      // Set success message and handle post-registration logic
      setSuccessMessage('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      // Handle registration failure
      setError('Registration failed. Please try again.');
      console.log('Registration error:', error); // Add a console log for debugging
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
