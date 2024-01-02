// frontend/src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      const response = await axios.post(`${process.env.REACT_APP_API}/login`, {
        username,
        password,
      });
      setIsLoading(false);

      // Assuming the response contains a token and a success message
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); // Navigate to the dashboard or another page
    } catch (err) {
      setIsLoading(false);
      setError('Invalid username or password');
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
    </div>
  );
};

export default Login;
