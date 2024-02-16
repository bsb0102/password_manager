import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/api.js';
import './Settings.css'; // Make sure you have this CSS file for styling
import Modal from '../../modals/Mfa.jsx';

function Settings() {
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [mfaSetupData, setMfaSetupData] = useState(null);
  const [mfaToken, setMfaToken] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const [confirmationModal, setConfirmationModal] = useState(false); 
  const [successModal, setSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    setUserId(decodedToken.userId);
    
    const fetchMfaStatus = async () => {
      try {
        const response = await axiosInstance.get('/api/mfa-status');
        setIsMfaEnabled(response.data.mfaEnabled);
      } catch (error) {
        console.error('Fehler beim Abrufen des MFA-Status:', error);
      }
    };
    fetchMfaStatus();
  }, []);

  const handleDisableMFA = async () => {
    // Vor dem Deaktivieren von MFA das Bestätigungsmodal anzeigen
    setConfirmationModal(true);
  };

  const handleAddMFA = async () => {
    try {
        const response = await axiosInstance.post('/api/add-mfa');
        setMfaSetupData(response.data);
        setShowModal(true); // Modal anzeigen
    } catch (error) {
        console.error('Error adding MFA:', error);
    }
  };

  const handleVerifyToken = async () => {
    try {
      const response = await axiosInstance.post('/api/verify-mfa', { token: mfaToken });
      // Check if the verification was successful
      if (response.data === 'MFA is verified and enabled') { // Adjust the condition based on your actual API response
        setIsMfaEnabled(true);
        setShowModal(false); // Modal schließen
        setSuccessModal(true); // Erfolgsmodal anzeigen
        setTimeout(() => {
          setSuccessModal(false);
        }, 3000);
      } else {
        // Fehlerbehandlung, wenn die Token-Überprüfung fehlschlägt
        setError('Invalid MFA token. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying MFA token:', error);
      setError('Error verifying MFA token. Please try again.');
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return {};
    }
  };


  const confirmDisableMFA = async () => {
    try {
      await axiosInstance.post('/api/disable-mfa');
      setIsMfaEnabled(false);
      setMfaSetupData(null);
    } catch (error) {
      console.error('Error disabling MFA:', error);
      setError('Error disabling MFA. Please try again.');
    }
    setConfirmationModal(false); // Close the confirmation modal regardless of success or failure
  };

  

  const handleChangeUsername = async () => {
    try {
      // Make a request to change the username using newUsername state
      await axiosInstance.put('/api/change-username', { newUsername });
      // Optionally update the UI or show a success message
      // ...
    } catch (error) {
      console.error('Error changing username:', error);
      // Handle errors or show an error message
      // ...
    }
  };

  const handleChangePassword = async () => {
    try {

      const requestData = {
        userId: userId,
        currentPassword: currentPassword,
        newPassword: newPassword
      };

      console.log(requestData)

      const changePass = await axiosInstance.put('/api/change-password', requestData);

      if (changePass) {
        console.log("Successfully saved Password")
        setNewPassword("");
        setCurrentPassword("");
      } else {
        console.log("Failed to save password")
        setNewPassword("");
        setCurrentPassword("");
      }

    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleDeleteMFA = async () => {
    try {
      await axiosInstance.delete('/api/delete-mfa');
      setIsMfaEnabled(false);
    } catch (error) {
      console.error('Fehler beim Löschen von MFA:', error);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-right">
        <h2>Settings</h2>
        <div className={`mfa-status ${isMfaEnabled ? 'active' : 'inactive'}`}>
          MFA {isMfaEnabled ? 'Active' : 'Not Active'}
        </div>

        <div className="settings-options">
          <div className="setting-item">
            <label>Change Username</label>
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <button onClick={handleChangeUsername}>Change Username</button>
          </div>
          <div className="setting-item">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Change Password</button>
          </div>

          <div className="setting-item">
            <label>MFA</label>
            {isMfaEnabled ? (
              <>
                <button onClick={handleDisableMFA}>Disable MFA</button>
              </>
            ) : (
              <button onClick={handleAddMFA}>Add MFA</button>
            )}
          </div>
        </div>
      </div>
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
      {successModal && (
        <Modal onClose={() => setSuccessModal(false)}>
          <div className="success-modal-content">
            <h3>MFA Added Successfully</h3>
            <p>Your account is now more secure with multi-factor authentication enabled.</p>
            <button onClick={() => setSuccessModal(false)} className="close-modal-button">OK</button>
          </div>
        </Modal>
      )}
      <div className="confirmation-modal">
        {confirmationModal && (
          <Modal onClose={() => setConfirmationModal(false)}>
            <div className="mfa-confirmation">
              <h3>Disable MFA</h3>
              <p>Are you sure you want to disable MFA?</p>
              <div className="confirmation-buttons">
                <button onClick={confirmDisableMFA}>Yes</button>
                <button onClick={() => setConfirmationModal(false)}>No</button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Settings;
