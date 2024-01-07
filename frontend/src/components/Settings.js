import React, { useState } from 'react';
import axiosInstance from '../api/api.js';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

function Settings() {
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [mfaSetupData, setMfaSetupData] = useState(null);

  // Function to handle enabling MFA
  const handleEnableMFA = async () => {
    try {
      const response = await axiosInstance.post('/api/enable-mfa');
      setMfaSetupData(response.data);
      setIsMfaEnabled(true);
      // You might want to display the QR code from response.data here
    } catch (error) {
      console.error('Error enabling MFA:', error);
      // Handle error
    }
  };

  // Function to handle disabling MFA
  const handleDisableMFA = async () => {
    try {
      await axios.post('/api/disable-mfa');
      setIsMfaEnabled(false);
    } catch (error) {
      console.error('Error disabling MFA:', error);
      // Handle error
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <h2>Welcome to Settings!</h2>
        <div>
          <h3>Settings Options:</h3>
          <ul>
            <li>Change Username</li>
            <li>Change Password</li>
            <li>Add Payment</li>
            <li>
              {isMfaEnabled ? (
                <button onClick={handleDisableMFA}>
                  Disable MFA
                </button>
              ) : (
                <button onClick={handleEnableMFA}>
                  Enable MFA
                </button>
              )}
            </li>
          </ul>
          {mfaSetupData && (
            <div>
              {/* Display MFA setup information */}
              {/* For example, show the QR Code for scanning */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
