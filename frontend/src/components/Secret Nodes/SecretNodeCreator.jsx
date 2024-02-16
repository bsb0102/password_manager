import React, { useState } from 'react';

const SecretNodeCreator = ({ onSave }) => {
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    // Überprüfe, ob das Passwort und der Inhalt vorhanden sind
    if (password && content) {
      // Überprüfe, ob der Inhalt nicht mehr als 2000 Zeichen hat
      if (content.length <= 2000) {
        // Speichere den Secret Node
        onSave({ password, content });
        // Setze das Passwort und den Inhalt zurück
        setPassword('');
        setContent('');
      } else {
        alert('Der Inhalt darf maximal 2000 Zeichen haben.');
      }
    } else {
      alert('Bitte geben Sie ein Passwort und Inhalt ein.');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginBottom: '20px' }}>Secret Node erstellen</h2>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Passwort:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginLeft: '10px' }} />
      </label>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Inhalt (max. 2000 Zeichen):
        <textarea value={content} onChange={(e) => setContent(e.target.value)} style={{ marginLeft: '10px', width: '100%', minHeight: '100px' }} />
      </label>
      <button onClick={handleSave} style={{ marginRight: '10px' }}>Speichern</button>
    </div>
  );
};

export default SecretNodeCreator;
