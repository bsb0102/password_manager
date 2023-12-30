import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function TwoFactorAuth({ qrCode }) {
  const [token, setToken] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    // Implement your verify token logic here
  };

  return (
    <Container>
      <h2 className="text-center">Two-Factor Authentication</h2>
      <Form onSubmit={handleVerify}>
        <Form.Group>
          <Form.Label>Enter the token from your authentication app</Form.Label>
          <Form.Control
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="123456"
            required
          />
        </Form.Group>
        {qrCode && (
          <div className="text-center">
            <img src={qrCode} alt="QR Code" />
            <p>Scan this QR code with your authentication app</p>
          </div>
        )}
        <Button variant="primary" type="submit">
          Verify
        </Button>
      </Form>
    </Container>
  );
}

export default TwoFactorAuth;
