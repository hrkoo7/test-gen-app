const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authenticate = require('../middlewares/authMiddleware');

// Protect both AI endpoints with `authenticate`
router.post('/summaries', authenticate, aiController.generateSummaries);
router.post('/test-code', authenticate, aiController.generateTestCode);

module.exports = router;
