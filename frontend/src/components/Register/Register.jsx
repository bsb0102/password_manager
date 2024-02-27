import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/api.js';
import { getCsrfToken } from '../../utils/csrfUtils.js';
import '../Login/AuthForm.css';
import { AlertContext } from '../Alert/AlertService.js';
import VerificationModal from './VerificationModal/VerificationModal.jsx'; // Import the modal component

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false); // State to control modal visibility
  const [verificationError, setVerificationError] = useState(''); // State to manage verification error
  const { setAlert } = useContext(AlertContext);

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

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setAlert('error', 'Please enter a valid email address.');
      return;
    }

    const data = {
      username: username,
      password: password,
      _csrf: csrfToken,
    };

    try {
      const registrationResponse = await axiosInstance.post('/api/register', data);

      if (registrationResponse.status === 201) {
        setShowVerificationModal(true); // Open the verification code modal
      } else if (registrationResponse.status === 400) {
        const responseData = await registrationResponse.json();
        if (responseData.error === 'User already exists') {
          setAlert('error', 'User with this email already exists.');
        } else {
          setAlert('error', responseData.error);
        }
      } else {
        setAlert('error', 'Failed to Register!');
      }
    } catch (error) {
      console.error('Registration error:', error.request.response);
      setAlert('error', error.request.response);
    }
  };

  const handleVerificationSubmit = async (verificationCode) => {
    const verificationData = {
      username: username,
      verificationCode: verificationCode,
      password: password,
      _csrf: csrfToken,
    };

    try {
      const verificationResponse = await axiosInstance.post('/api/verifyCode', verificationData);

      if (verificationResponse.status === 200) {
        setAlert('success', 'Successfully registered and verified!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        setShowVerificationModal(false); // Close the modal after successful verification
      } else {
        setAlert('error', 'Verificationcode incorrect. Please try again.'); // Set verification error if failed
      }
    } catch (error) {
      console.error('Verification error:', error);
      setAlert('error', 'Failed to verify. Please try again.'); // Set verification error if failed
    }
  };

  return (
    <div>
      <div className="auth-form-container animated-bg">
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register</h2>
          <input type="hidden" name="_csrf" value={csrfToken} />
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <input
            type="text"
            placeholder="E-Mail"
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
      {showVerificationModal && (
        <VerificationModal
          onClose={() => setShowVerificationModal(false)}
          onSubmit={handleVerificationSubmit}
          verificationError={verificationError} // Pass verification error to the modal
        />
      )}
    </div>
  );
};

export default Register;
