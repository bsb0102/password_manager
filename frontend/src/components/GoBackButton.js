import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button type="button" className="go-back-button" onClick={() => navigate(-1)}>
      Go Back
    </button>
  );
};

export default GoBackButton;
