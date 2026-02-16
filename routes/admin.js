const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuthenticated } = require('../middleware/auth');
const admin = require('../controllers/adminController');

const fs = require('fs');

// Multer config for file uploads
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  }
});

// Auth routes (no middleware)
router.get('/login', admin.loginPage);
router.post('/login', admin.login);
router.get('/logout', admin.logout);

// Protected routes
router.use(isAuthenticated);
router.get('/', admin.dashboard);

// Projects
router.get('/projects', admin.projectsList);
router.get('/projects/create', admin.projectCreate);
router.post('/projects', upload.single('image'), admin.projectStore);
router.get('/projects/:id/edit', admin.projectEdit);
router.post('/projects/:id', upload.single('image'), admin.projectUpdate);
router.post('/projects/:id/delete', admin.projectDelete);

// Skills
router.get('/skills', admin.skillsList);
router.post('/skills', admin.skillStore);
router.post('/skills/:id', admin.skillUpdate);
router.post('/skills/:id/delete', admin.skillDelete);

// Contacts
router.get('/contacts', admin.contactsList);
router.get('/contacts/:id', admin.contactShow);
router.post('/contacts/:id/delete', admin.contactDelete);

// Profile
router.get('/profile', admin.profileEdit);
router.post('/profile', upload.single('profile_image'), admin.profileUpdate);

// GitHub Import
router.get('/github', admin.githubImportPage);
router.post('/github/fetch', admin.githubFetch);
router.post('/github/import', admin.githubImport);

// Certificates
router.get('/certificates', admin.certificatesList);
router.post('/certificates', admin.certificateStore);
router.post('/certificates/:id', admin.certificateUpdate);
router.post('/certificates/:id/delete', admin.certificateDelete);

// Journey
router.get('/journey', admin.journeyList);
router.post('/journey', admin.journeyStore);
router.post('/journey/:id', admin.journeyUpdate);
router.post('/journey/:id/delete', admin.journeyDelete);

module.exports = router;
