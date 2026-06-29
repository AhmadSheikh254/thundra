const express = require('express');
const router = express.Router();
const { generatePlan, saveProject, getProjects } = require('../controllers/projectController');
const { chatHandler } = require('../controllers/chatController');

router.post('/generate-plan', generatePlan);
router.post('/save-project', saveProject);
router.get('/projects', getProjects);
router.post('/chat', chatHandler);

module.exports = router;
