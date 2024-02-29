import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to extract token from URL
import axiosInstance from '../../api/api.js';
import { useNavigate } from 'react-router-dom';
import {AlertContext} from '../Alert/AlertService.js';

const ResetPassword = () => {
    const { token } = useParams();
    const [isValidToken, setIsValidToken] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setAlert } = useContext(AlertContext);


    useEffect(() => {
      const verifyToken = async () => {
        try {
            const response = await axiosInstance.get(`/api/verify-reset-password-token/${token}`);
            setIsValidToken(response.data.isValid);
        } catch (error) {
            console.error('Error verifying token:', error);
        }
      };
  
      verifyToken();
    }, [token]);
  
    const handleResetPassword = async () => {
      if (password !== confirmPassword) {
        setMessage('Passwords do not match');
        return;
      }
  
      try {
        const response = await axiosInstance.post('/api/reset-password', { token, password });
        setAlert("success", "Successfully resetted Password")
        navigate('/login');
      } catch (error) {
        console.error('Error resetting password:', error);
        setAlert('error', 'Error resetting password. Please try again.');
      }
    };
  
    if (!isValidToken) {
      return <div>Invalid or expired token. Please request a new password reset link.</div>;
    }
  
    return (
      <div>
        <h2>Reset Password</h2>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button onClick={handleResetPassword}>Reset Password</button>
        {message && <p>{message}</p>}
      </div>
    );
  };
  
  export default ResetPassword;
