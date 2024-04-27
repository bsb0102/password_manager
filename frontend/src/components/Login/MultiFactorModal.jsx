import React, { useState, useEffect, useContext } from 'react';
import '../ResetPassword/ResetPasswordModal.css';
import axiosInstance from '../../api/api.js';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../Alert/AlertService.js';
import Cookies from 'js-cookie';

const MultiFactorModal = ({ isOpen, mfaType, onMfaSubmit, onClose, tempHeaderToken }) => {
  const [mfaToken, setMfaToken] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false); // Track whether email has been sent
  const navigate = useNavigate();
  const { setAlert } = useContext(AlertContext);

  console.log("Temp headers;; ",tempHeaderToken)

  useEffect(() => {
    if (mfaType === 'email' && isOpen && !emailSent) {
      sendEmailMfa();
      setEmailSent(true);
    }
  }, [isOpen, emailSent]); // Trigger sending email MFA when modal is opened

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
    if (!mfaToken) {
      setAlert('Error', 'MFA token is missing');
      return;
    }
    try {
      console.log("Secindg email mfa")
      const response = await axiosInstance.post('/api/verify-email-mfa', { verificationCode: mfaToken, tempToken: tempHeaderToken });
      if (response.data.status === true) {
        setAlert('Success', 'Successfully verified EMAIL MFA');
        Cookies.set('token', tempHeaderToken, { expires: 7 });
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tempHeaderToken}`;
          localStorage.setItem('token', tempHeaderToken);
          navigate('/home');
      } else {
        setAlert('Error', 'Failed to verify email MFA');
      }
    } catch (error) {
      if (error.response) {
        setAlert("error", "Invalid MultiFactor Key. Try again")
        setMfaToken('')
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      setAlert('Error', 'Failed to send email MFA');
    }
  };

  const verifyGoogleMfa = async () => {
    try {

      const response = await axiosInstance.post(
        '/api/verify-mfa',
        { token: mfaToken, tempToken:  tempHeaderToken},
        { headers: { "x-temp-token": `Bearer ${tempHeaderToken}` } }
      );
      try {
        if (response.data && response.data.success === true) {
          console.log("Successfull login");
          Cookies.set('token', tempHeaderToken, { expires: 7 });
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tempHeaderToken}`;
          localStorage.setItem('token', tempHeaderToken);
          navigate('/home');
        } else {

        }
      } catch (e) {
        console.log("error: ", e)
      }

    } catch (error) {
      console.error(error);
    }
  };

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
