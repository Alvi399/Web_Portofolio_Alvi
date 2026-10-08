require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const { sequelize } = require('./models');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const expressLayouts = require('express-ejs-layouts');

const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3005;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null
    }
  },
  crossOriginEmbedderPolicy: false
}));

// View engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'default-secret')) {
  console.error('FATAL ERROR: SESSION_SECRET must be explicitly set in production environment.');
  process.exit(1);
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'Sessions',
  checkExpirationInterval: 15 * 60 * 1000, // Clean up expired sessions every 15 minutes
  expiration: 24 * 60 * 60 * 1000 // 1 day
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Sync the session table
sessionStore.sync();
app.use(flash());
const { csrfMiddleware } = require('./helpers/csrfUtils');
const { i18nMiddleware } = require('./helpers/i18nHelper');
app.use(csrfMiddleware);
app.use(i18nMiddleware);
const { navMiddleware } = require('./helpers/navState');
app.use(navMiddleware);

// Make session user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? { id: req.session.userId, username: req.session.username } : null;
  // Flash messages are read lazily by views (so asset/404 requests never consume them)
  res.locals.getFlash = (type) => req.flash(type);
  // Escape HTML, then convert newlines to <br> (safe for use with <%- %>)
  res.locals.nl2br = (text) => String(text == null ? '' : text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    .replace(/\r?\n/g, '<br>');
  res.locals.siteUrl = (process.env.SITE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
  res.locals.displayName = (p) => (p && (p.display_name || p.full_name)) ? (p.display_name || p.full_name) : 'Malvix';
  // Multilingual dynamic content helper
  res.locals.tField = (obj, field) => {
    if (!obj) return '';
    if (res.locals.lang === 'en' && obj[field + '_en']) return obj[field + '_en'];
    return obj[field] || '';
  };
  // Add image helper
  const { getImageUrl } = require('./helpers/imageHelper');
  res.locals.getImageUrl = getImageUrl;
  next();
});

// Mount Hosted Remote MCP Server (SSE for remote AI clients)
const { attachMcpToExpress } = require('./helpers/mcpServer');
attachMcpToExpress(app);

// Routes
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('error', { title: '404', message: 'Page not found', currentPage: '' });
});

// Start server
async function start() {
  const MAX_RETRIES = 5;
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      await sequelize.authenticate();
      console.log('✓ Database connected');
      // Schema is managed by migrations (npm run migrate); auto-sync only in development
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync();
        console.log('✓ Tables synced (development)');
      }
      app.listen(PORT, () => {
        console.log(`✓ Server running at http://localhost:${PORT}`);
      });
      break; // Success, exit loop
    } catch (err) {
      retries++;
      console.error(`✗ Connection attempt ${retries} failed:`, err.message);
      if (retries < MAX_RETRIES) {
        console.log(`Waiting 5 seconds before retrying...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error('✗ Max retries reached. Exiting.');
        process.exit(1);
      }
    }
  }
}

start();
