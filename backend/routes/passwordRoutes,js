const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware

router.post('/addPassword', authenticateToken, passwordController.addPassword);
router.get('/getPasswords', authenticateToken, passwordController.getPasswords);
router.delete('/deletePassword/:id', authenticateToken, passwordController.deletePassword);

module.exports = router;
