import React, { useState, useEffect, useContext } from 'react';
import '../ResetPassword/ResetPasswordModal.css';
import axiosInstance from '../../api/api.js';
import { useNavigate } from 'react-router-dom';
import {AlertContext} from '../Alert/AlertService.js';

const MultiFactorModal = ({ isOpen, mfaType, onMfaSubmit, onClose }) => {
  const [mfaToken, setMfaToken] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const { setAlert } = useContext(AlertContext);


  useEffect(() => {
    if (mfaType === 'email') {
      sendEmailMfa();
    }
  }, [isOpen]); // Trigger sending email MFA when modal is opened

  const sendEmailMfa = async () => {
    try {
      // Send request to send email MFA
      await axiosInstance.post('/api/send-email-mfa', {});
      console.log("Send Email MFA");
    } catch (error) {
      console.error('Error sending email MFA:', error);
    }
  };

  const verifyEmailMfa = async () => {
    try {
      // Send request to send email MFA
      await axiosInstance.get('/api/mfa-status');
      console.log("Send Email MFA 123123123123123123");
    } catch (error) {
      console.error('Error sending email MFA:', error);
    }
  };


    // console.log(response.body);

      
      // if ("success" === response.body.status) {
      //     navigate('/home');
      //     setAlert("Success", "Successfully logged in with multi-factor authentication.");
      // } else if (response.status === 401) {
      //     console.log("wrong key")
      //     setAlert("Error", "Unauthorized access. Please log in again.");
      // } else {
      //     setAlert("Error", `Failed to log in: ${response.body.status}`);
      //     console.log(response);
      // }


  const verifyGoogleMfa = async () => {
    try {
      const response = await axiosInstance.post(
        '/api/verify-mfa',
        { token: mfaToken },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );
      
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mfaType === 'email') {
      verifyEmailMfa();
    } else if (mfaType === 'google') {
      verifyGoogleMfa();
    }
  };

  const handleResendEmail = () => {
    if (cooldown === 0) {
      setCooldown(1); // Set cooldown period of 30s seconds
      sendEmailMfa();
      setTimeout(() => {
        setCooldown(0); // Reset cooldown after 30 seconds
      }, 30000);
    }
  };

  // Render modal only if isOpen is true
  if (!isOpen) return null;

  return (
    <div className="reset-password-modal-overlay">
      <div className="reset-password-modal-content">
        <button className="reset-password-modal-close-button" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <h2 className="reset-password-modal-title">{mfaType === 'email' ? 'Email Verification' : 'Google Authenticator Verification'}</h2>
        <form className="reset-password-modal-form">
          <input
            className="reset-password-modal-input"
            type="text"
            placeholder="Enter Multi-factor Code"
            value={mfaToken}
            onChange={(e) => setMfaToken(e.target.value)}
            required
          />
          {mfaType === 'email' && (
            <button className="reset-password-modal-resend-button" type="button" onClick={handleResendEmail} disabled={cooldown > 0}>
              {cooldown > 0 ? `Resend Email (${cooldown})` : 'Resend Email'}
            </button>
          )}
          <div className="reset-password-modal-actions">
            <button className="reset-password-modal-cancel-button" type="button" onClick={onClose}>Cancel</button>
            <button className="reset-password-modal-submit-button" type="submit" onClick={handleSubmit}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default MultiFactorModal;
