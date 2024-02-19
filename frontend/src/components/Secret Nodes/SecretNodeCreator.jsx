import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/api.js';

function SecretNodeCreator() {
  const [secretNodes, setSecretNodes] = useState([]);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeContent, setNewNodeContent] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [unlockPassphrase, setUnlockPassphrase] = useState('');
  const [unlockedContent, setUnlockedContent] = useState({});
  const [unlockAttemptFailed, setUnlockAttemptFailed] = useState({});

  useEffect(() => {
    fetchSecretNodes();
  }, []);

  const fetchSecretNodes = async () => {
    try {
      const response = await axiosInstance.get('/api/getSecretNodes');
      setSecretNodes(response.data);
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
      setUnlockedContent(prev => ({ ...prev, [id]: 'Unable to unlock content with provided passphrase.' }));
    }
  };

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
        <ul>
          {secretNodes.map((node) => (
            <li key={node._id}>
              <h3>{node.title}</h3>
              {unlockedContent[node._id] && !unlockAttemptFailed[node._id] ? (
                <p>{unlockedContent[node._id]}</p>
              ) : (
                <>
                  <input
                    type="password"
                    placeholder="Enter passphrase to unlock"
                    value={unlockPassphrase}
                    onChange={(e) => setUnlockPassphrase(e.target.value)}
                  />
                  <button onClick={() => unlockSecretNode(node._id)}>Unlock</button>
                </>
              )}
              {unlockAttemptFailed[node._id] && <p style={{color: 'red'}}>Unlock failed. Try again.</p>}
              <button onClick={() => deleteSecretNode(node._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SecretNodeCreator;
