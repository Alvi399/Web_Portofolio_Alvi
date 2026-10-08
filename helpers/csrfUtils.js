const crypto = require('crypto');

function csrfMiddleware(req, res, next) {
  if (!req.session) return next();

  // Generate session CSRF token if not exists
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(24).toString('hex');
  }

  // Make csrfToken available to all EJS views
  res.locals.csrfToken = req.session.csrfToken;

  // Safe HTTP methods do not require CSRF validation
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // For POST/PUT/DELETE, verify token
  const token = (req.body && req.body._csrf) ||
                (req.query && req.query._csrf) ||
                req.headers['x-csrf-token'];

  if (!token || token !== req.session.csrfToken) {
    return res.status(403).render('error', {
      title: '403 Forbidden',
      message: 'Sesi atau token CSRF tidak valid. Silakan muat ulang halaman dan coba lagi.',
      currentPage: ''
    });
  }

  next();
}

module.exports = { csrfMiddleware };
