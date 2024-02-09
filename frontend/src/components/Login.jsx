import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/api.js';
import '../styles/Login.css';
import Modal from '../modals/Mfa.jsx'; // Import your MFA modal component here

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [showMfaModal, setShowMfaModal] = useState(false); // State to control MFA modal visibility
  const [mfaToken, setMfaToken] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    setIsLoading(true);
  
    const data = {
      username: username,
      password: password,
      _csrf: csrfToken,
    };
  
    try {
      const response = await axiosInstance.post('/api/login', data);
  
      // Always store the JWT token
      localStorage.setItem('token', response.data.token);
  
      if (response.data.requireMfa) {
        // MFA is required; store the JWT token temporarily
        localStorage.setItem('tempToken', response.data.token);
        setShowMfaModal(true); // Show the MFA modal
      } else {
        // Successful login without MFA
        navigate('/home'); // Redirect to the authenticated part of the app
      }
    } catch (error) {
      setError('Failed to Login');
      if (error.response) {
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

  const handleMfaLogin = async () => {
    try {
      const tempToken = localStorage.getItem('tempToken'); // Retrieve the temporary JWT token
      if (!tempToken) {
        setError('Temporary JWT token not found');
        return;
      }
  
      // Verify MFA token with the temporary JWT token
      await axiosInstance.post(
        '/api/verify-mfa',
        { token: mfaToken },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );
  
      // Handle successful MFA login
      setShowMfaModal(false);
      navigate('/home');
    } catch (error) {
      console.error('Error verifying MFA token:', error);
      setError('Invalid MFA token. Please try again.');
      setMfaToken(''); // Clear the MFA token input field
      setTimeout(() => setError(''), 3000); // Clear the error message after 3 seconds
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
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="auth-input"
        />
        <button type="submit" disabled={isLoading} className="auth-button">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="alt-action">
          Don't have an account? <span onClick={() => navigate('/register')} className="alt-action-link">Register here</span>
        </p>
    </form>
  
      {/* MFA Modal */}
      {showMfaModal && (
        <Modal onClose={() => setShowMfaModal(false)}>
          <div className="mfa-login">
            <h3>MFA Login</h3>
            <input
              type="text"
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value)}
              placeholder="Enter MFA token"
              className="auth-input mfa-input"
            />
            {error && <div className="error-message">{error}</div>}
            <button onClick={handleMfaLogin} className="auth-button mfa-button">Login with MFA</button>
          </div>
        </Modal>
      )}
    </div>
  );
  
}  

export default Login;
