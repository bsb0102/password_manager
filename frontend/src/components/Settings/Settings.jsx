import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../api/api.js';
import './Settings.css';
import Modal from '../../modals/Mfa.jsx';
import {AlertContext} from '../Alert/AlertService.js';

function Settings() {
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [mfaSetupData, setMfaSetupData] = useState(null);
  const [mfaToken, setMfaToken] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEmailMfaModal, setShowEmailMfaModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false); 
  const [successModal, setSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newUsernamePassword, setNewUsernamePassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [emailNotificationStatus, setEmailNotificationStatus] = useState({});
  const [verificationCode, setVerificationCode] = useState('');
  const { setAlert } = useContext(AlertContext);


  useEffect(() => {

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    setUserId(decodedToken.userId);
    
    const fetchMfaStatus = async () => {
      try {
        const response = await axiosInstance.get('/api/mfa-status');
        setIsMfaEnabled(response.data.mfaEnabled || response.data.emailMFAEnabled);
      } catch (error) {
        console.error('Fehler beim Abrufen des MFA-Status:', error);
      }
    };


    const fetchEmailNotificationStatus = async () => {
      try {
        const response = await axiosInstance.get('/api//email-settings');
        setEmailNotificationStatus(response.data)
        setEmailNotificationStatus

      } catch (error) {
        console.log("failed to fetch Email Notification")
      }
    }

    fetchMfaStatus();
    fetchEmailNotificationStatus();
  }, []);


  const handleEmailNotificationChange = async (parentKey, childKey, checked) => {
    try {
      // Make API call to update the notification status
      const response = await axiosInstance.post('/api/update-email-notification-status', {
        parentKey,
        childKey,
        status: checked
      });
  
      // Update the state locally upon successful response
      setEmailNotificationStatus(prevStatus => ({
        ...prevStatus,
        [parentKey]: {
          ...prevStatus[parentKey],
          [childKey]: checked
        }
      }));
  
      // Show success message or handle response as needed
      setAlert('success', response.data.message);
    } catch (error) {
      console.error('Error updating email notification status:', error);
      // Show error message or handle error as needed
      setAlert('error', 'Failed to update email notification status');
    }
  };
  
  
  

  const handleDisableMFA = async () => {
    // Vor dem Deaktivieren von MFA das Bestätigungsmodal anzeigen
    setConfirmationModal(true);
  };

  const handleAddMFA = async () => {
    try {
        const response = await axiosInstance.post('/api/add-mfa');
        setMfaSetupData(response.data);
        setShowModal(true);
    } catch (error) {
        console.error('Error adding MFA:', error);
    }
  };

  const handleAddEmailMFA = async () => {
    await sendEmailMfa(); // This will trigger the email MFA code to be sent
    setShowEmailMfaModal(true); // Assuming you want to show a modal for code input, set this to true
  };

  const handleVerifyToken = async () => {
    try {
      const response = await axiosInstance.post('/api/verify-mfa', { token: mfaToken });
      // Check if the verification was successful
      if (response.data.success === true) { // Adjust the condition based on your actual API response
        setIsMfaEnabled(true);
        setShowModal(false); // Modal schließen
        setMfaToken('');
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
        }, 3000);
      } else {
        setError('Invalid MFA token. Please try again.');
        setMfaToken('');
      }
    } catch (error) {
      console.error('Error verifying MFA token:', error);
      setError('Error verifying MFA token. Please try again.');
      setMfaToken('');
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return {};
    }
  };

  const handleVerifyEmailMFA = async (e) => {
    // verificationCode
    e.preventDefault(); // Prevents the form from submitting and redirecting
    try {
      const response = await axiosInstance.post('/api/verify-mfa', { emailMFAToken: verificationCode });
      // Check if the verification was successful
      if (response.data.success === true) { // Adjust the condition based on your actual API response
        setIsMfaEnabled(true);
        setShowEmailMfaModal(false); // Close the modal
        setVerificationCode('');
        setAlert('success', 'Successfully enabled EMAIL MFA');
      } else {
        setAlert('error', 'Invalid MFA token. Please try again.');
        setVerificationCode('');
      }
    } catch (error) {
      // Handle error if request fails
      if (error.response) {
        // The request was made and the server responded with a status code
        // Extract error message from server response
        const errorMessage = error.response.data.message || 'An error occurred. Please try again.';
        setAlert('error', errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request made but no response received:', error.request);
        setAlert('error', 'No response received from server. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error setting up request:', error.message);
        setAlert('error', 'An error occurred. Please try again.');
      }
      setVerificationCode('');
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


  const sendEmailMfa = async () => {
    try {
      
      // Send request to send email MFA
      const response = await axiosInstance.get(
        '/api/send-email-mfa');

    } catch (error) {
      console.error('Error sending email MFA:', error);
    }
  };
  

  const handleChangeUsername = async () => {
    try {
      await axiosInstance.post('/api/update-username', { 
        newUsername: newUsername,
        password: newUsernamePassword 
      });

      setAlert('success', 'Successfully updated Username')

      setNewUsername('');
      setNewPassword('');

    } catch (error) {
      console.error('Error changing username:', error);
      setAlert('error', 'Failed to Change Username')
    }
  };

  

  const handleChangePassword = async () => {
    try {

      const requestData = {
        userId: userId,
        currentPassword: currentPassword,
        newPassword: newPassword
      };
      const changePass = await axiosInstance.put('/api/change-password', requestData);

      if (changePass) {
        console.log("Successfully saved Password")
        setAlert("success", "This is a success message!");
        setNewPassword("");
        setCurrentPassword("");
      } else if (!changePass) {
        console.log("Failed to save password")
        setAlert("success", "This is a success message!");
        setNewPassword("");
        setCurrentPassword("");
      }

    } catch (error) {
      console.error('Error changing password:', error);
      setAlert("error", "Failed to save Password")
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
            <label>Change E-Mail</label>
            <input
              type="text"
              placeholder="New E-Mail"
              value={newUsername} // Update the value to reflect the newUsername state
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm with Password"
              value={newUsernamePassword} // Update the value to reflect the newUsernamePassword state
              onChange={(e) => setNewUsernamePassword(e.target.value)}
            />
            <button onClick={handleChangeUsername}>Change E-Mail</button> {/* Call handleChangeUsername function */}
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
                <button className="mfa-button" onClick={handleDisableMFA}>Disable MFA</button>
              </>
            ) : (
              <>
                <button className="mfa-button" onClick={handleAddMFA}>Add Google MFA</button>
                <button className="mfa-button" onClick={handleAddEmailMFA}>Add Email MFA</button>
              </>
              
            )}
          </div>
          
          <div className="setting-item">
            <label>Email Notifications</label>
            {Object.entries(emailNotificationStatus).map(([parentKey, childObject]) => (
                <div key={parentKey}>
                    {Object.entries(childObject).map(([childKey, value]) => (
                        <div key={childKey}>
                            <input
                                className="notification-checkbox"
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleEmailNotificationChange(parentKey, childKey, e.target.checked)}
                            />
                            <label className="notification-label">
                                {childKey === 'loginNotification' ? 'Login Notification' : childKey}
                            </label>
                        </div>
                    ))}
                </div>
            ))}
        </div>

        </div>

      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
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
          </div>
        </div>
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

  {showEmailMfaModal && (
    <div className="reset-password-modal-overlay">
      <div className="reset-password-modal-content">
        <button className="reset-password-modal-close-button" onClick={() => setShowEmailMfaModal(false)} aria-label="Close modal">
          &times;
        </button>
        <h2 className="reset-password-modal-title">Enter Verification Code</h2>
        <form className="reset-password-modal-form" onSubmit={(e) => handleVerifyEmailMFA(e)}>
          <input
            className="reset-password-modal-input"
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <div className="reset-password-modal-actions">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
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
