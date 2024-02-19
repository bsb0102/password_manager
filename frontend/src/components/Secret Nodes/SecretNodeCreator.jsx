import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/api.js';
import './secretNodes.css'; // Import CSS file for styling
import Spinner from "../Alert/Spinner";

function SecretNodeCreator() {
  const [secretNodes, setSecretNodes] = useState([]);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeContent, setNewNodeContent] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [unlockPassphrase, setUnlockPassphrase] = useState('');
  const [unlockedContent, setUnlockedContent] = useState({});
  const [unlockAttemptFailed, setUnlockAttemptFailed] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSecretNodes();
  }, []);

  const fetchSecretNodes = async () => {
    try {
      const response = await axiosInstance.get('/api/getSecretNodes');
      setSecretNodes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching secret nodes:', error);
    }
  };

  const addSecretNode = async () => {
    try {
      await axiosInstance.post('/api/addSecretNode', {
        title: newNodeTitle,
        content: newNodeContent,
        passphrase: passphrase,
      });
      setNewNodeTitle('');
      setNewNodeContent('');
      setPassphrase('');
      fetchSecretNodes();
    } catch (error) {
      console.error('Error adding secret node:', error);
    }
  };

  const deleteSecretNode = async (id) => {
    try {
      await axiosInstance.delete(`/api/deleteSecretNode/${id}`);
      fetchSecretNodes();
    } catch (error) {
      console.error('Error deleting secret node:', error);
    }
  };

  const unlockSecretNode = async (id) => {
    try {
      const response = await axiosInstance.post(`/api/openSecretNode/${id}`, { passphrase: unlockPassphrase });
      setUnlockedContent(prev => ({ ...prev, [id]: response.data.content }));
      setUnlockPassphrase('');
    } catch (error) {
      console.error('Error unlocking secret node:', error);
      setUnlockAttemptFailed(prev => ({ ...prev, [id]: true }));
    }
  };

  const toggleNodeLock = (id) => {
    // Toggle the lock status of the node
    setUnlockedContent(prev => ({ ...prev, [id]: null })); // Clear unlocked content
    setUnlockAttemptFailed(prev => ({ ...prev, [id]: false })); // Clear unlock attempt status
  };

  if (loading) {
    return (
    <div>
      <Spinner />
    </div>
    )
  }

  return (
    <div className="App">
      <h1>Secret Nodes</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newNodeTitle}
          onChange={(e) => setNewNodeTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={newNodeContent}
          onChange={(e) => setNewNodeContent(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passphrase"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
        />
        <button onClick={addSecretNode}>Add Secret Node</button>
      </div>
      <div>
        <h2>Existing Secret Nodes:</h2>
        <ul className="node-list">
          {secretNodes.map((node) => (
            <li key={node._id} className="node-item">
              <div className="node-header">
                <h3>{node.title}</h3>
                {/* Modal */}
                {unlockAttemptFailed[node._id] && (
                  <div className="modal">
                    <div className="modal-content">
                      <span className="close" onClick={() => setUnlockAttemptFailed(prev => ({ ...prev, [node._id]: false }))}>
                        &times;
                      </span>
                      <input
                        type="password"
                        placeholder="Enter passphrase"
                        value={unlockPassphrase}
                        onChange={(e) => setUnlockPassphrase(e.target.value)}
                      />
                      <button onClick={() => {
                        unlockSecretNode(node._id);
                        setUnlockAttemptFailed(prev => ({ ...prev, [node._id]: false }));
                        setUnlockPassphrase(''); // Clear passphrase input field
                      }}>Unlock</button>
                      {unlockAttemptFailed[node._id] === true && <p className="error-message">Incorrect passphrase. Try again.</p>}
                    </div>
                  </div>
                )}
                {/* Lock icon */}
                <button className="lock-icon" onClick={() => {
                  if (unlockedContent[node._id]) {
                    setUnlockedContent(prev => ({ ...prev, [node._id]: null }));
                    setUnlockPassphrase(''); // Clear passphrase input field
                  } else {
                    setUnlockAttemptFailed(prev => ({ ...prev, [node._id]: true }));
                  }
                }}>
                  {unlockedContent[node._id] ? '🔓' : '🔒'}
                </button>
              </div>
              {unlockedContent[node._id] && (
                <p className="node-content">{unlockedContent[node._id]}</p>
              )}
              <button onClick={() => deleteSecretNode(node._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
  
  
  
  
  
}

export default SecretNodeCreator;
