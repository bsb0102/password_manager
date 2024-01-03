// frontend/src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/api.js'; // Import axiosInstance
import '../../styles/AuthForm.css';


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to handle loading

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {

      const response = await axiosInstance.post('/auth/login', { // Use axiosInstance here
        username,
        password,
      });
      setIsLoading(false);

      // Assuming the response contains a token and a success message
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); // Navigate to the dashboard or another page
    } catch (err) {
      console.log(err)
      setIsLoading(false);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || 'Invalid username or password');
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from the server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {/* Add a link to the registration page */}
        <p className="alt-action">
          Don't have an account? <span onClick={() => navigate('/register')}>Register here</span>
        </p>
      </form>
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeLoginModal} />
    </div>
  );  
};

export default Login;
