import React, { useState } from 'react';
import './ResetPasswordModal.css'; // Ensure the CSS file is updated with new styles

const ResetPasswordModal = ({ onClose, onSubmit, verificationError }) => {
  const [resetEmail, setResetEmail] = useState('');
  
  // Function to reset verification code state
  const resetVerificationCode = () => {
    setResetEmail('');
  };

  // Handle input change with formatting (if necessary)
  const handleInputChange = (event) => {
    // Directly use the input value for email verification, assuming no format modification is needed
    setResetEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(resetEmail);
    setResetEmail(); // Reset verification code after submission
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <h2 className="modal-title">Enter E-Mail Address</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            className="modal-input"
            type="text"
            placeholder="Verification Code"
            value={resetEmail}
            onChange={handleInputChange}
            required
          />
          <div className="modal-actions">
            <button className="submit-button" type="submit">Submit</button>
            <button className="cancel-button" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
