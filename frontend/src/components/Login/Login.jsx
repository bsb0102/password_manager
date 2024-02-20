import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/api.js';
import './AuthForm.css';
import Modal from '../../modals/Mfa.jsx'; // Import your MFA modal component here
import Cookies from 'js-cookie';

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
  
      if (response.data.message === "Login successful") {

        // Store the token in cookies
        Cookies.set('token', response.data.token, { expires: 7 }); // Token is stored for 7 days. Adjust as necessary.
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        localStorage.setItem('token', response.data.token);
        navigate('/home');

        // If MFA is not required, navigate to /home
        if (!response.data.requireMfa) {
          // Navigate to /home using React Router
          navigate('/home'); // Assuming 'navigate' is obtained from useNavigate() hook.
          console.log("Successfully logged in");
        } else {
          localStorage.setItem('tempToken', response.data.token);
          setShowMfaModal(true);
        }
      } else {
        setError('Failed to Login');
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="alt-action">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')}>Register here</span>
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
            />
            {error && <div className="error-message">{error}</div>}
            <button onClick={handleMfaLogin}>Login with MFA</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Login;
