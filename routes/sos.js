// routes/sos.js
const express = require('express');
const router = express.Router();
const sosController = require('../controllers/SOSController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/trigger', authMiddleware, sosController.triggerSOS);

module.exports = router;
