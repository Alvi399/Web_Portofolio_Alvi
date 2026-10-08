const rateLimit = require('express-rate-limit');

// 5 attempts per 15 minutes for admin login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: (req, res) => {
    res.status(429).render('admin/login', {
      layout: false,
      error: 'Terlalu banyak percobaan login dari IP ini. Silakan coba lagi setelah 15 menit.',
      csrfToken: res.locals.csrfToken
    });
  }
});

// 5 submissions per hour for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: (req, res) => {
    req.flash('error', 'Terlalu banyak pesan dikirim dari IP Anda. Silakan coba lagi nanti.');
    res.status(429).redirect('/contact');
  }
});

// 60 requests per minute for image proxy
const proxyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: (req, res) => {
    res.status(429).send('Rate limit exceeded for image proxy');
  }
});

// 5 submissions per 15 minutes for public testimonial form
const testimonialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: (req, res) => {
    req.flash('error', 'Terlalu banyak pengiriman testimoni dari IP Anda. Silakan coba lagi setelah beberapa menit.');
    res.status(429).redirect('/testimonial');
  }
});

module.exports = { loginLimiter, contactLimiter, proxyLimiter, testimonialLimiter };

