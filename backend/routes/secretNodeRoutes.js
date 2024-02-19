const express = require('express');
const router = express.Router();
const secretNodeController = require('../controllers/secretNodesController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/addSecretNode', authenticateToken, secretNodeController.addSecretNode);
router.get('/getSecretNodes', authenticateToken, secretNodeController.getSecretNodes);
router.delete('/deleteSecretNode/:id', authenticateToken, secretNodeController.deleteSecretNode);
router.post("/openSecretNode/:id", authenticateToken, secretNodeController.openSecretNode);

module.exports = router;
