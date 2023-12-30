// frontend/src/components/MainPage.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import Login from './components/Login/Login';

Modal.setAppElement('#root');

function MainPage({ onAuthenticated }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <div>
      <h1>Welcome to Our Application</h1>
      <button onClick={openModal}>Log In</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
      >
        <Login onAuthenticated={onAuthenticated} />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

export default MainPage;
