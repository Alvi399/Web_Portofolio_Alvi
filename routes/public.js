const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.home);
router.get('/about', homeController.about);
router.get('/projects', homeController.projects);
router.get('/projects/:slug', homeController.projectDetail);
router.get('/contact', homeController.contact);
router.post('/contact', homeController.submitContact);

module.exports = router;
