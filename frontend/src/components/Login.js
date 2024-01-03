import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/api.js';
import { getCsrfToken } from '../utils/csrfUtils';
import '../styles/AuthForm.css';


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      document.querySelector('.auth-form').classList.add('active');
    }, 100);

    // Fetch the CSRF token and store it in a state variable
    getCsrfToken()
      .then((token) => {
        setCsrfToken(token);
      })
      .catch((error) => {
        console.error('Failed to fetch CSRF token:', error);
      });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/api/login', {
        username,
        password,
      },
      {
        headers: {
          'X-CSRF-Token': csrfToken, // Use the CSRF token in the headers
        },
      });

      setIsLoading(false);

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); // Navigate to the dashboard or another page
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        setError(err.response.data.message || 'Invalid username or password');
      } else if (err.request) {
        setError('No response from the server. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="auth-form-container animated-bg">
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
        <p className="alt-action">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')}>Register here</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
