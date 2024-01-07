import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/api.js';
import '../styles/Settings.css'; // Assuming you have this CSS file for styling
import Modal from '../modals/Mfa.jsx';

function Settings() {
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [mfaSetupData, setMfaSetupData] = useState(null);
  const [mfaToken, setMfaToken] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [error, setError] = useState(''); // State to manage error message

  useEffect(() => {
    // Fetch the current MFA status from the backend
    const fetchMfaStatus = async () => {
      try {
        // Try to get the isMfaEnabled state from local storage
        const storedIsMfaEnabled = localStorage.getItem('isMfaEnabled');
        if (storedIsMfaEnabled) {
          setIsMfaEnabled(JSON.parse(storedIsMfaEnabled));
        } else {
          // If not found in local storage, fetch from the backend
          const response = await axiosInstance.get('/api/mfa-status');
          setIsMfaEnabled(response.data.isMfaEnabled);
        }
      } catch (error) {
        console.error('Error fetching MFA status:', error);
      }
    };
    fetchMfaStatus();
  }, []);

  const handleEnableMFA = async () => {
    try {
      const response = await axiosInstance.post('/api/enable-mfa');
      setMfaSetupData(response.data);
      setShowModal(true); // Show modal on successful MFA enablement
    } catch (error) {
      console.error('Error enabling MFA:', error);
    }
  };

  const handleVerifyToken = async () => {
    try {
      await axiosInstance.post('/api/verify-mfa', { token: mfaToken });
      setIsMfaEnabled(true);
      setMfaSetupData(null);
      setShowModal(false); // Hide modal on successful token verification
      setError(''); // Clear any previous error message
      localStorage.setItem('isMfaEnabled', JSON.stringify(true)); // Save to local storage
    } catch (error) {
      console.error('Error verifying MFA token:', error);
      setError('Invalid MFA token. Please try again.'); // Set error message
    }
  };

  const handleDisableMFA = async () => {
    try {
      await axiosInstance.post('/api/disable-mfa');
      setIsMfaEnabled(false);
      setMfaSetupData(null);
      localStorage.setItem('isMfaEnabled', JSON.stringify(false)); // Save to local storage
    } catch (error) {
      console.error('Error disabling MFA:', error);
    }
  };

  return (
    <div className="settings-container">
      <h2>Welcome to Settings!</h2>
      <div className="settings-options">
        <ul>
          <li>Change Username</li>
          <li>Change Password</li>
          <li>Add Payment</li>
          <li>
            {isMfaEnabled ? (
              <button onClick={handleDisableMFA}>Disable MFA</button>
            ) : (
              <button onClick={handleEnableMFA}>Enable MFA</button>
            )}
          </li>
        </ul>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <div className="mfa-setup">
              <h3>Setup MFA</h3>
              <p>Scan this QR Code with your MFA app:</p>
              <div className="qr-code-container">
                <img src={mfaSetupData.qrCode} alt="MFA QR Code" />
              </div>
              <input
                type="text"
                value={mfaToken}
                onChange={(e) => setMfaToken(e.target.value)}
                placeholder="Enter MFA token"
              />
              {error && <p className="error-message">{error}</p>}
              <button onClick={handleVerifyToken}>Verify Token</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Settings;
