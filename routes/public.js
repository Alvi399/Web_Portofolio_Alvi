const express = require('express');
const router = express.Router(); // trigger restart 7
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const homeController = require('../controllers/homeController');
const imageController = require('../controllers/imageController');

const { contactLimiter, proxyLimiter, testimonialLimiter } = require('../middleware/rateLimiter');
const { cacheRoute } = require('../middleware/cache');

// Setup multer storage for public testimonial photo upload
const uploadDir = path.join(__dirname, '../public/uploads/testimonials');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = 'testimonial-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const uploadTestimonialPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
    const mimeOk = allowed.test(file.mimetype);
    cb(null, extOk && mimeOk);
  }
});

router.get('/', cacheRoute(3600), homeController.home);
router.get('/about', cacheRoute(3600), homeController.about);
router.get('/projects', cacheRoute(3600), homeController.projects);
router.get('/projects/:slug', cacheRoute(3600), homeController.projectDetail);
router.get('/contact', cacheRoute(3600), homeController.contact);
router.post('/contact', contactLimiter, homeController.submitContact);
router.get('/certificates', cacheRoute(3600), homeController.certificates);
router.get('/journey', cacheRoute(3600), homeController.journey);
router.get('/resume', cacheRoute(3600), homeController.resume);
router.get('/cv', cacheRoute(3600), homeController.cv);
router.get('/cv.txt', cacheRoute(3600), homeController.cvText);
router.get('/sitemap.xml', cacheRoute(86400), homeController.sitemap);
router.get('/robots.txt', cacheRoute(86400), homeController.robots);

// Public Testimonial Submission Form
router.get('/testimonial', homeController.testimonialForm);
router.get('/give-testimonial', (req, res) => res.redirect('/testimonial'));
router.get('/testimonial/give', (req, res) => res.redirect('/testimonial'));
router.post('/testimonial', testimonialLimiter, uploadTestimonialPhoto.single('photo'), homeController.submitTestimonial);

// Analytics tracking endpoint
router.post('/api/track-event', homeController.trackEventApi);

// Image proxy endpoint
router.get('/api/image-proxy', proxyLimiter, imageController.proxyImage);

module.exports = router;

