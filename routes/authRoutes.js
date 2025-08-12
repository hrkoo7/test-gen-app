const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/github', authController.githubLogin);
router.get('/github/callback', authController.githubCallback);

module.exports = router;
