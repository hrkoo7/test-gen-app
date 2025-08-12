const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/repos',         authenticate, githubController.getUserRepos);
router.get('/files',         authenticate, githubController.getRepoFiles);
router.get('/file-content',  authenticate, githubController.getFileContent);

module.exports = router;
