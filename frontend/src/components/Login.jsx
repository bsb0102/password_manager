import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/api.js';
import '../styles/AuthForm.css';
import Alert from '../utils/AlertService';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const [csrfToken, setCsrfToken] = useState(''); // State to store the CSRF token

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the CSRF token from the server using Axios
        const response = await axiosInstance.get('/api/csrf-token');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set isLoading to true while processing the login
  
    // Prepare the data to be sent
    const data = {
      username: username,
      password: password,
      _csrf: csrfToken
    };
  
    try {
      // Use axiosInstance to send the POST request
      const response = await axiosInstance.post('/api/login', data);
  
      // Handle successful login
      localStorage.setItem('token', response.data.token);
      showAlert("success", "Successfully logged in...")
      // axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/home');
    } catch (error) {
      showAlert("danger", "Failed to log in...")
      if (error.response) {
        console.error('Login error:', error.response.data);
        console.error(data)
        setError(error.response.data.error);
      } else if (error.request) {
        console.error('Network error:', error.request);
      } else {
        console.error('Other error:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container animated-bg">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
        <input type="hidden" name="_csrf" value={csrfToken} />
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
        <div className="password-input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <i className="bi-eye-slash" /> : <i className="bi-eye" />}
          </span>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="alt-action">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')}>Register here</span>
        </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
