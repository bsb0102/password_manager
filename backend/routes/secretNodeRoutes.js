const express = require('express');
const router = express.Router();
const secretNoteController = require('../controllers/secretNotesController.js');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/addSecretNote', authenticateToken, secretNoteController.addSecretNote);
router.get('/getSecretNotes', authenticateToken, secretNoteController.getSecretNotes);
router.delete('/deleteSecretNote/:id', authenticateToken, secretNoteController.deleteSecretNote);
router.post("/openSecretNote/:id", authenticateToken, secretNoteController.openSecretNote);
router.put("/updateSecretNote/:id", authenticateToken, secretNoteController.updateSecretNote)

module.exports = router;
