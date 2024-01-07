const express = require('express');
const router = express.Router();
const mfaController = require('../controllers/mfaController');
const authenticateToken = require('../middleware/authenticateToken'); // Assuming MFA operations require a user to be authenticated

// Route to enable MFA for a user, requires authentication
router.post('/enable-mfa', authenticateToken, mfaController.enableMFA);

// Route to verify MFA token, typically used in the login process
// It may or may not require authenticateToken middleware based on how you handle the login process
router.post('/verify-mfa', authenticateToken, mfaController.verifyToken);

// Route to disable MFA for a user, requires authentication
router.post('/disable-mfa', authenticateToken, mfaController.disableMFA);

module.exports = router;
