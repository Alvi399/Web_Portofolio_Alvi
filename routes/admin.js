const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { RESUME_DIR } = require('../helpers/fileUtils');
const { isAuthenticated } = require('../middleware/auth');
const admin = require('../controllers/adminController');

const fs = require('fs');

const { loginLimiter } = require('../middleware/rateLimiter');
const { clearCache } = require('../middleware/cache');

// Clear cache on any admin POST/PUT/DELETE
router.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method) && req.path !== '/login') {
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 400) clearCache();
    });
  }
  next();
});

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
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase().replace('.', ''));
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  }
});

// Profile upload: profile image (to uploads/) + CV PDF (to uploads/resume/, random name)
const RESUME_MAX_BYTES = 5 * 1024 * 1024;
if (!fs.existsSync(RESUME_DIR)) {
  fs.mkdirSync(RESUME_DIR, { recursive: true });
}
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, file.fieldname === 'resume_file' ? RESUME_DIR : uploadDir),
  filename: (req, file, cb) => {
    if (file.fieldname === 'resume_file') {
      return cb(null, crypto.randomBytes(16).toString('hex') + '.pdf');
    }
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const profileUploader = multer({
  storage: profileStorage,
  limits: { fileSize: RESUME_MAX_BYTES },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase().replace('.', '')) && allowed.test(file.mimetype);
    cb(null, ok);
  }
}).fields([{ name: 'profile_image', maxCount: 1 }]);

function profileUpload(req, res, next) {
  profileUploader(req, res, (err) => {
    if (!err) return next();
    let msg = 'Upload gagal. Periksa file Anda dan coba lagi.';
    if (err.code === 'LIMIT_FILE_SIZE') msg = 'Ukuran file terlalu besar (maksimal 5 MB).';
    req.flash('error', msg);
    res.redirect('/admin/profile');
  });
}

// Auth routes (no middleware)
router.get('/login', admin.loginPage);
router.post('/login', loginLimiter, admin.login);
router.get('/logout', admin.logout);

// Protected routes
router.use(isAuthenticated);
router.get('/', admin.dashboard);

// Projects
router.get('/projects', admin.projectsList);
router.get('/projects/create', admin.projectCreate);
router.post('/projects/reorder', admin.reorderProjects);
router.post('/projects', upload.single('image'), admin.projectStore);
router.get('/projects/:id/edit', admin.projectEdit);
router.post('/projects/:id', upload.single('image'), admin.projectUpdate);
router.post('/projects/:id/delete', admin.projectDelete);

// Skills
router.get('/skills', admin.skillsList);
router.get('/skills/create', admin.skillCreate);
router.get('/skills/:id/edit', admin.skillEdit);
router.post('/skills/reorder', admin.reorderSkills);
router.post('/skills', admin.skillStore);
router.post('/skills/:id', admin.skillUpdate);
router.post('/skills/:id/delete', admin.skillDelete);

// Contacts
router.get('/contacts', admin.contactsList);
router.get('/contacts/:id', admin.contactShow);
router.post('/contacts/:id/delete', admin.contactDelete);

// Profile
router.get('/profile', admin.profileEdit);
router.post('/profile', profileUpload, admin.profileUpdate);

// GitHub Import
router.get('/github', admin.githubImportPage);
router.post('/github/fetch', admin.githubFetch);
router.post('/github/import', admin.githubImport);

// Certificates
router.get('/certificates', admin.certificatesList);
router.get('/certificates/create', admin.certificateCreate);
router.get('/certificates/:id/edit', admin.certificateEdit);
router.post('/certificates', upload.single('image'), admin.certificateStore);
router.post('/certificates/:id', upload.single('image'), admin.certificateUpdate);
router.post('/certificates/:id/delete', admin.certificateDelete);

// Journey
router.get('/journey', admin.journeyList);
router.get('/journey/create', admin.journeyCreate);
router.get('/journey/:id/edit', admin.journeyEdit);
router.post('/journey', upload.single('image'), admin.journeyStore);
router.post('/journey/:id', upload.single('image'), admin.journeyUpdate);
router.post('/journey/:id/delete', admin.journeyDelete);

// Testimonials
router.get('/testimonials', admin.testimonialsList);
router.get('/testimonials/create', admin.testimonialCreate);
router.get('/testimonials/:id/edit', admin.testimonialEdit);
router.post('/testimonials', upload.single('image'), admin.testimonialStore);
router.post('/testimonials/:id', upload.single('image'), admin.testimonialUpdate);
router.post('/testimonials/:id/delete', admin.testimonialDelete);

module.exports = router;
