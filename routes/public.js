const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const imageController = require('../controllers/imageController');

router.get('/', homeController.home);
router.get('/about', homeController.about);
router.get('/projects', homeController.projects);
router.get('/projects/:slug', homeController.projectDetail);
router.get('/contact', homeController.contact);
router.post('/contact', homeController.submitContact);
router.get('/certificates', homeController.certificates);
router.get('/journey', homeController.journey);

// Image proxy endpoint
router.get('/api/image-proxy', imageController.proxyImage);

module.exports = router;
