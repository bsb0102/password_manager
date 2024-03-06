import React from 'react';
import '../styles/Mfa.css'; // Ensure you have this CSS file

const Modal = ({ children, onClose }) => {
    return (
      <div className="reset-password-modal-overlay" onClick={onClose}>
        <div className="reset-password-modal-content" onClick={e => e.stopPropagation()}>
        <button className="reset-password-modal-close-button" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;
