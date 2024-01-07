import React from 'react';
import '../styles/Mfa.css'; // Ensure you have this CSS file

const Modal = ({ children, onClose }) => {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <span className="modal-close-btn" onClick={onClose}>&times;</span>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;
