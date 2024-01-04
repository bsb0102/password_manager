import React, { useState } from "react";
import '../styles/PasswordManager.css'; // Import your CSS file
import { FaPencilAlt, FaTrash } from 'react-icons/fa'; // Import icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const initialData = [
  {
    id: 1,
    Website: "example1.com",
    email: "user1@example.com",
    username: "user1",
    password: "Lol123",
  },
  {
    id: 2,
    Website: "example2.org",
    email: "user2@example.org",
    username: "user2",
    password: "Lol123",
  },
];
const CustomTable = () => {
  const [data, setData] = useState(initialData);
  const [showPassword, setShowPassword] = useState(false); // Password visibility state
  const [inputBackgroundColor, setInputBackgroundColor] = useState("white");
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newPasswordData, setNewPasswordData] = useState({

    id: "",
    Website: "",
    email: "",
    username: "",
    password: "",
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showGenerateStrongPassword, setShowGenerateStrongPassword] = useState(false);

  const togglePasswordVisibility = (id) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAddClick = () => {
    setShowAddPasswordModal(true);
  };

  const handleEditClick = (item) => {
    setEditData(item);
    setShowAddPasswordModal(true);
  };

  const handleDeleteClick = (id) => {
    setShowDeleteConfirmation(true);
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    // Implement logic to delete data here.
    // For simplicity, let's log the deleted ID for now.
    console.log("Deleted ID:", deleteId);

    // You can update the data state to remove the deleted item.
    // For example:
    // setData(data.filter((item) => item.id !== deleteId));

    setShowDeleteConfirmation(false);
    setDeleteId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeleteId(null);
  };


  const handleGenerateStrongPasswordChange = () => {
    if (!showGenerateStrongPassword) {
      // Generate a strong password and populate the input field
      const generatedPassword = generateStrongPassword(); // Define your password generation logic
      setNewPasswordData({ ...newPasswordData, password: generatedPassword });
      setInputBackgroundColor("gray"); // Change input field background color
    } else {
      // Clear the password input field
      setNewPasswordData({ ...newPasswordData, password: "" });
      setInputBackgroundColor("white"); // Reset input field background color
    }
  
    setShowPassword(false); // Reset the password visibility when generating a password
    setShowGenerateStrongPassword(!showGenerateStrongPassword);
  };

  const generateStrongPassword = () => {
    const length = 12; // Change the length as needed
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  };

  const handleAddPasswordModalClose = () => {
    setShowAddPasswordModal(false);
    setEditData(null);
    setNewPasswordData({
      id: "",
      Website: "",
      email: "",
      username: "",
      password: "",
    });
    setShowGenerateStrongPassword(false);
  };

  const handleAddPasswordSubmit = () => {
    if (editData) {
      // Handle edit logic here (update the existing item).
      // For example:
      // setData(data.map((item) => (item.id === editData.id ? newPasswordData : item)));
    } else {
      // Handle add logic here (add a new item).
      // For example:
      // setData([...data, newPasswordData]);
    }

    // Close the modal
    handleAddPasswordModalClose();
  };


  

  return (
    <div className="table-container">
      <div className="table-box">
        <button onClick={handleAddClick} className="add-button">+</button>
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Website</th>
              <th>Email</th>
              <th>Username</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.Website}</td>
                <td>{item.email}</td>
                <td>{item.username}</td>
                <td>
                  {showPassword[item.id] ? (
                    <>
                      {item.password}
                      <button onClick={() => togglePasswordVisibility(item.id)}>
                        Hide
                      </button>
                    </>
                  ) : (
                    <>
                      {item.password.replace(/./g, "*")}
                      <button onClick={() => togglePasswordVisibility(item.id)}>
                        Show
                      </button>
                    </>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEditClick(item)} className="edit-button">
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => handleDeleteClick(item.id)} className="delete-button">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editData ? "Edit Password" : "Add Password"}</h2>
            <label>ID:
              <input
                type="text"
                value={newPasswordData.id}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, id: e.target.value })}
              />
            </label>
            <label>Website:
              <input
                type="text"
                value={newPasswordData.Website}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, Website: e.target.value })}
              />
            </label>
            <label>Email:
              <input
                type="text"
                value={newPasswordData.email}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, email: e.target.value })}
              />
            </label>
            <label>Username:
              <input
                type="text"
                value={newPasswordData.username}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, username: e.target.value })}
              />
            </label>
            <label>
            Password:
            <div className="password-input">
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPasswordData.password}
                  onChange={(e) => setNewPasswordData({ ...newPasswordData, password: e.target.value })}
                  disabled={showGenerateStrongPassword}
                  style={{ backgroundColor: inputBackgroundColor }} // Set input field background color
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </span>
              </div>
              <input
                type="checkbox"
                checked={showGenerateStrongPassword}
                onChange={handleGenerateStrongPasswordChange}
              />
              Generate Strong Password
            </div>
          </label>
            
            <button onClick={handleAddPasswordSubmit}>{editData ? "Save" : "Submit"}</button>
            <button onClick={handleAddPasswordModalClose}>Cancel</button>
          </div>
        </div>
        
      )}
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <div className="delete-content">
            <p>Are you sure you want to delete this data?</p>
            <button onClick={handleDeleteConfirm}>Yes</button>
            <button onClick={handleDeleteCancel}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;