import React from 'react';
import './Spinner.css'; // Import CSS file for styling
import LoadingSpin from "react-loading-spin";

const Spinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <LoadingSpin 
      primaryColor="blue"
      />
    </div>
  );
};

export default Spinner;
