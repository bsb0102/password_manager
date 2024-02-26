import React, { useState, useEffect, useContext } from "react";
import './PasswordManager.css';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { formatDate} from "../../utils/frontendUtils";
// import Alert from '../Alert/AlertService';
import axiosInstance from '../../api/api.js';
import Spinner from "../Alert/Spinner";

const PasswordManager = () => {
  const [data, setData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [inputBackgroundColor, setInputBackgroundColor] = useState("white");
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordGenerated, setPasswordGenerated] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(true);
  const [newPasswordData, setNewPasswordData] = useState({
    id: "",
    website: "",
    email: "",
    username: "",
    password: "",
  });

  const [passwordSettings, setPasswordSettings] = useState({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });



  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showGenerateStrongPassword, setShowGenerateStrongPassword] = useState(false);


  const maskPassword = (password) => '***';

  const fetchPasswords = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/getPasswords');
      setData(response.data.map(item => ({
        ...item,
        showPassword: false // Add a visibility flag for each password
        }
        )
        )
      );
      setLoading(false);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };



  useEffect(() => {
    const fetchPasswords = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/getPasswords');
        setData(response.data.map(item => ({
          ...item,
          showPassword: false // Add a visibility flag for each password
          }
          )
          )
        );
        setLoading(false);
      } catch (error) {
        console.error('Error fetching passwords:', error);
      }
    };

    fetchPasswords();
  }, []);


  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    setData(data.map(item =>
      item._id === id ? { ...item, showPassword: !item.showPassword } : item
    ));
  };

  const handleAddPasswordSubmit = async () => {
    try {
      if (!passwordGenerated && !newPasswordData.password) {
        // Check if the password is neither generated nor manually inputted
        setPasswordValidation(false);
        return;
      }
  
      const passwordPayload = {
        website: newPasswordData.website,
        email: newPasswordData.email,
        username: newPasswordData.username,
        password: newPasswordData.password, // Use the password from newPasswordData
      };

      console.log(passwordPayload)
  
      let response;
  
      if (editData) {
        // Always send the complete payload when updating
        response = await axiosInstance.put(`/api/updatePassword/${editData._id}`, passwordPayload);
        // alertMessage = 'Password updated successfully';
      } else {
        // Add a new item
        response = await axiosInstance.post("/api/addPassword", passwordPayload);
        // alertMessage = 'Password added successfully';
      }
  
      // Check if the response from the API contains the updated password
      const updatedPassword = response.data;

  
      // Update the newPasswordData state with the updated password
      setNewPasswordData({
        id: updatedPassword._id, // Use the updated ID if needed
        website: updatedPassword.website,
        email: updatedPassword.email,
        username: updatedPassword.username,
        password: updatedPassword.password, // Use the updated password
      });
  
      fetchPasswords(); 
  
      setShowAddPasswordModal(false);
      setEditData(null);
      setPasswordValidation(true); // Reset password validation
    } catch (error) {
      console.error("Error adding/updating password:", error);
      // setAlert({ show: true, message: 'Error processing request', className: 'error' });
    }
  };
  


  const handleAddClick = () => {
    setShowAddPasswordModal(true);
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setNewPasswordData({
      id: item._id,
      website: item.website,
      email: item.email,
      username: item.username,
      password: newPasswordData.password || item.password, // Use the existing password if not already set
    });
    setShowAddPasswordModal(true);
    setPasswordGenerated(false); // Set the flag that the password is not generated when editing
  };
  

  const handleDeleteClick = (id) => {
    console.log("Preparing to delete ID:", id); // Add this log to confirm the received ID
    setDeleteId(id);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await handleDeletePassword(deleteId);
    } catch (error) {
    } finally {
      setShowDeleteConfirmation(false);
      setDeleteId(null);
    }
  };
  
  const handleDeletePassword = async (id) => {
    if (id) {
      try {
        await axiosInstance.delete(`/api/deletePassword/${id}`);
        // setAlert({ show: true, message: 'Password deleted successfully', className: 'success' });
        setData(data.filter((item) => item._id !== id)); // Make sure to match the ID key used in your data items

      } catch (error) {
        console.error('Error deleting password:', error);
      }
    } else {
      console.log("No ID provided for deletion");
    }
  };


  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeleteId(null);
  };

  const handleGenerateStrongPasswordChange = () => {
    if (!showGenerateStrongPassword) {
      // Generate a strong password and populate the input field
      const generatedPassword = generatePassword();
      setNewPasswordData({ ...newPasswordData, password: generatedPassword });
      setPasswordGenerated(true);
      setInputBackgroundColor('gray'); // Set the background color when generated
    } else {
      // Clear the password input field
      setNewPasswordData({ ...newPasswordData, password: '' });
      setPasswordGenerated(false); // Set the password as not generated
      setInputBackgroundColor('white');
    }
  
    setShowPassword(false);
    setShowGenerateStrongPassword(!showGenerateStrongPassword);
  };
  

  const generatePassword = () => {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let characterPool = '';
    if (passwordSettings.onlyUppercase) characterPool += upperChars;
    if (passwordSettings.onlyLowercase) characterPool += lowerChars;
    if (passwordSettings.includeNumbers) characterPool += numberChars;
    if (passwordSettings.includeSymbols) characterPool += symbolChars;

    if (characterPool === '') {
        characterPool = upperChars + lowerChars + numberChars + symbolChars;
    }

    let password = '';
    const poolLength = characterPool.length;
    for (let i = 0; i < passwordSettings.length; i++) {
        const randomIndex = Math.floor(Math.random() * poolLength);
        password += characterPool[randomIndex];
    }

    setPasswordGenerated(true);

    return password;
};

  
  

  const handleAddPasswordModalClose = () => {
    setShowAddPasswordModal(false);
    setEditData(null);
    setNewPasswordData({
      id: "",
      website: "",
      email: "",
      username: "",
      password: "",
    });
    setShowGenerateStrongPassword(false);
  };

  if (loading) {
    return (
    <div>
      <Spinner />
    </div>
    )
  }


  return (
    <div className="table-container">
      <div className="table-header">
      <button onClick={handleAddClick} className="add-button">+</button>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Website</th>
              <th>Email</th>
              <th>Username</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="table-content">
        <table className="custom-table">
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  <td>{formatDate(item.updatedAt)}</td>
                  <td>{item.website}</td>
                  <td>{item.email}</td>
                  <td>{item.username}</td>
                  <td className="password-cell">
                    <div className="password-input">
                      <span>{item.showPassword ? item.password : '*****'}</span>
                      <span className="toggle-password" onClick={() => togglePasswordVisibility(item._id)}>
                        {item.showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button onClick={() => handleEditClick(item)} className="edit-button">
                      <FaPencilAlt />
                    </button>
                    <button onClick={() => handleDeleteClick(item._id)} className="delete-button">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>





      {showAddPasswordModal && (
        <div className="modal-content">
<<<<<<< HEAD:frontend/src/components/PasswordManager.jsx
          <span className="close-button" onClick={handleAddPasswordModalClose}>&times;</span>
          <h2>{editData ? "Edit Password" : "Add Password"}</h2>
            
            <label>Website:
              <input
=======
        <span className="close-button" onClick={handleAddPasswordModalClose}>&times;</span>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>{editData ? "Edit Password" : "Add Password"}</h2>
        <div className="form-group">
            <label>Website:</label>
            <input
>>>>>>> v1:frontend/src/components/PasswordManager/PasswordManager.jsx
                type="text"
                value={newPasswordData.website || (editData ? editData.website : '')}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, website: e.target.value })}
                className="input-field"
            />
        </div>
        <div className="form-group">
            <label>Email:</label>
            <input
                type="text"
                value={newPasswordData.email || (editData ? editData.email : '')}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, email: e.target.value })}
                className="input-field"
            />
        </div>
        <div className="form-group">
            <label>Username:</label>
            <input
                type="text"
                value={newPasswordData.username || (editData ? editData.username : '')}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, username: e.target.value })}
                className="input-field"
            />
        </div>
        <div className="form-group password-group">
          <label>Password:</label>
          <div className="input-container">
              <input
                  type={showPassword ? "text" : "password"}
                  value={newPasswordData.password}
                  onChange={(e) => setNewPasswordData({ ...newPasswordData, password: e.target.value })}
                  className={`input-field ${!passwordValidation ? 'error-input' : ''}`}
                  disabled={showGenerateStrongPassword}
              />
              <span className={`toggle-password ${showPassword ? '' : 'hidden'}`} onClick={() => setShowPassword(false)}>
                  <FontAwesomeIcon icon={faEyeSlash} />
              </span>
              <span className={`toggle-password ${showPassword ? 'hidden' : ''}`} onClick={() => setShowPassword(true)}>
                  <FontAwesomeIcon icon={faEye} />
              </span>
          </div>
          {!passwordValidation && (
              <div className="error-message">Password cannot be empty</div>
          )}
      </div>







      

          <div className="password-settings" style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Password Length:
              <input
                type="range"
                min="8"
                max="20"
                value={passwordSettings.length}
                onChange={(e) => setPasswordSettings({ ...passwordSettings, length: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </label>
            <div className="checkbox-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={passwordSettings.onlyUppercase}
                  onChange={(e) => setPasswordSettings({ ...passwordSettings, onlyUppercase: e.target.checked })}
                />
                Uppercase
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={passwordSettings.onlyLowercase}
                  onChange={(e) => setPasswordSettings({ ...passwordSettings, onlyLowercase: e.target.checked })}
                />
                Lowercase
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={passwordSettings.includeNumbers}
                  onChange={(e) => setPasswordSettings({ ...passwordSettings, includeNumbers: e.target.checked })}
                />
                Numbers
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={passwordSettings.includeSymbols}
                  onChange={(e) => setPasswordSettings({ ...passwordSettings, includeSymbols: e.target.checked })}
                />
                Symbols
              </label>
            </div>
            <button
              className="gen-button"
              onClick={() => {
                const generatedPassword = generatePassword();
                setNewPasswordData({ ...newPasswordData, password: generatedPassword });
                setPasswordGenerated(true);
              }}
              style={{ width: '100%' }}
            >
              Generate Strong Password
            </button>
          </div>
          <div className="button-container">
            <button className="save-button" onClick={handleAddPasswordSubmit}>{editData ? "Save" : "Submit"}</button>
            <button className="cancel-button" onClick={handleAddPasswordModalClose}>Cancel</button>
          </div>
        </div>
      )}


      {showDeleteConfirmation && (
      <div className="delete-confirmation">
      <div className="delete-content">
        <p className="confirmation-text">
          Are you sure you want to delete this data?
        </p>
        <button 
          onClick={() => {
            handleDeleteConfirm();
          }}
          className="confirm-button delete-button">
          Yes
        </button>
        <button onClick={handleDeleteCancel} className="confirm-button cancel-button">
          No
        </button>
      </div>
    </div>    
    )}
    </div>
  );
}

export default PasswordManager;
