// Alert.jsx

import { useState, useEffect } from "react";

const Alert = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      onClose(); // Call onClose when the alert disappears
    }, 5000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  let bgColor;
  switch (type) {
    case 'success':
      bgColor = 'rgba(76, 175, 80, 0.8)'; // Green with transparency
      break;
    case 'error':
      bgColor = 'rgba(244, 67, 54, 0.8)'; // Red with transparency
      break;
    case 'info':
      bgColor = 'rgba(255, 152, 0, 0.8)'; // Orange with transparency
      break;
    default:
      bgColor = 'rgba(0, 0, 0, 0.8)'; // Default to black with transparency
  }

  const alertStyle = {
    backgroundColor: bgColor,
    borderRadius: '10px', // Rounded corners
    padding: '10px', // Add padding for better appearance
    marginBottom: '10px', // Add margin to separate alerts
  };

  return (
    visible && (
      <div className="alert" style={alertStyle} role="alert">
        <strong>{message}</strong>
        <div className="bottom-bar" />
      </div>
    )
  );
};

export default Alert;
