import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/api.js';
import '../styles/Login.css';
import Modal from '../modals/Mfa.jsx'; // Import your MFA modal component here
import axiosInstance from '../../api/api.js';
import './AuthForm.css';
import Cookies from 'js-cookie';
import ResetPasswordModal from "../ResetPassword/ResetPasswordModal.jsx"
import {AlertContext} from '../Alert/AlertService.js';
import MultiFactorModal from './MultiFactorModal'


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [showMfaModal, setShowMfaModal] = useState(false); // State to control MFA modal visibility
  const [mfaToken, setMfaToken] = useState('');
  const [mfaType, setMfaType] = useState(''); // State to determine the type of MFA
  const { setAlert } = useContext(AlertContext);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [tempMFAToken, setTempMFAToken] = useState("");

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
        if (!response.data.requireMfa) {
          Cookies.set('token', response.data.token, { expires: 7 });
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          localStorage.setItem('token', response.data.token);
          navigate('/home');
        } else {
          const tempToken = response.data.token;
          // localStorage.setItem('tempToken', response.data.token);
          // Cookies.set('tempToken', tempToken, { expires: 1 }); // Set temporary token in cookie with 1-day expiry
          const response_mfa = await axiosInstance.get('/api/mfa-status', {
            headers: {
              'x-temp-token': tempToken, // Send temporary token in headers
            }
          });
          await setMfaType(response_mfa.data.mfaType);
          setTempMFAToken(tempToken)
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
        console.error('Error:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleForgotPassword = () => {
    setShowResetPasswordForm(true); // Show the PasswordResetForm when "Forgot Password" link is clicked
  };
  const handleForgotPasswordClose = () => {
    setShowResetPasswordForm(false);
  };
  

  const handleMfaLogin = async () => {
    try {
      setShowMfaModal(false);
      navigate('/home');
    } catch (error) {
      console.error('Error verifying MFA token:', error);
      setError('Invalid MFA token. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };
<<<<<<< HEAD
=======


  const submitResetPassword = async (username) => {
    try {
      await axiosInstance.post(
        '/api/request-password-reset',
        {username: username}
        )
      console.log("Resetting Password")
      handleForgotPasswordClose();
      setAlert("success", "Successfully sent Email for Password Reset")

    } catch( error ) {
      console.log(error)
      setAlert("error", "Failed to sent Email for Password Reset")
    }
  }
  
>>>>>>> v1
  

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
        <MultiFactorModal
          isOpen={showMfaModal}
          mfaType={mfaType}
          onMfaSubmit={handleMfaLogin} // Your existing MFA login handler
          onClose={() => setShowMfaModal(false)} // Function to close the modal
          tempMFAToken={tempMFAToken}
        />
      )}
    </div>
  );
  
}  

export default Login;