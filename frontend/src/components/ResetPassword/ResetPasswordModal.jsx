import React, { useState } from 'react';
import './ResetPasswordModal.css'; // Ensure the CSS file is updated with new styles

const ResetPasswordModal = ({ onClose }) => {
  const [resetEmail, setResetEmail] = useState('');
  

  const submitResetPassword = () => {
    try {
      console.log("Submitting Password")
      event.preventDefault();
      setResetEmail();
    } catch( error ) {
      console.log(error)
    }
  }

  // Handle input change with formatting (if necessary)
  const handleInputChange = (event) => {
    // Directly use the input value for email verification, assuming no format modification is needed
    setResetEmail(event.target.value);
  };

  return (
    <div className="reset-password-modal-overlay">
      <div className="reset-password-modal-content">
        <button className="reset-password-modal-close-button" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <h2 className="reset-password-modal-title">Send Password reset to Email</h2>
        <form onSubmit={submitResetPassword} className="reset-password-modal-form">
          <input
            className="reset-password-modal-input"
            type="text"
            placeholder="Enter E-Mail Address"
            value={resetEmail}
            onChange={handleInputChange}
            required
          />
          <div className="reset-password-modal-actions">
            <button className="reset-password-modal-cancel-button" type="button" onClick={onClose}>Cancel</button>
            <button className="reset-password-modal-submit-button" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );  
}

export default ResetPasswordModal;
