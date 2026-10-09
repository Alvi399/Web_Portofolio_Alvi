const request = require('supertest');
const express = require('express');

// Mock database models and external services to keep tests fast and isolated
jest.mock('../models', () => {
  return {
    sequelize: {
      authenticate: jest.fn().mockResolvedValue(),
      sync: jest.fn().mockResolvedValue()
    },
    Profile: {
      findOne: jest.fn().mockResolvedValue({
        full_name: 'Muhammad Alvi Kirana Zulfan Nazal',
        display_name: 'Malvix',
        headline: 'Full Stack Developer',
        availability_status: 'open_to_work',
        bio: 'Developer bio'
      })
    },
    Project: {
      findAll: jest.fn().mockResolvedValue([]),
      findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] }),
      findOne: jest.fn().mockImplementation(({ where }) => {
        if (where && where.slug === 'valid-project' && where.status === 'published') {
          return Promise.resolve({
            id: 1,
            title: 'Valid Project',
            slug: 'valid-project',
            description: 'Test description',
            status: 'published'
          });
        }
        return Promise.resolve(null);
      })
    },
    Skill: {
      findAll: jest.fn().mockResolvedValue([])
    },
    Contact: {
      create: jest.fn().mockImplementation((data) => Promise.resolve({ id: 1, ...data })),
      findAll: jest.fn().mockResolvedValue([])
    },
    Certificate: {
      findAll: jest.fn().mockResolvedValue([]),
      findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] })
    },
    Journey: {
      findAll: jest.fn().mockResolvedValue([]),
      findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] })
    },
    Testimonial: {
      findAll: jest.fn().mockResolvedValue([])
    },
    Event: {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      findAll: jest.fn().mockResolvedValue([])
    },
    User: {
      findOne: jest.fn().mockResolvedValue(null)
    }
  };
});

// Import app after mocking models
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

function createTestApp() {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false
  }));
  app.use(flash());
  
  // Minimal view setup for testing endpoints
  app.use(require('express-ejs-layouts'));
  app.set('layout', './layouts/main');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'ejs');

  app.use(require('cookie-parser')());
  app.use(require('../helpers/i18nHelper').i18nMiddleware);
  app.use((req, res, next) => {
    res.locals.user = null;
    res.locals.getFlash = () => [];
    res.locals.nl2br = (s) => s;
    res.locals.siteUrl = 'http://localhost:3005';
    res.locals.displayName = () => 'Malvix';
    res.locals.getImageUrl = (url) => url;
    res.locals.csrfToken = 'test-token';
    res.locals.tField = (obj, field) => {
      if (!obj) return '';
      if (res.locals.lang === 'en' && obj[field + '_en']) return obj[field + '_en'];
      return obj[field] || '';
    };
    next();
  });

  const publicRoutes = require('../routes/public');
  const adminRoutes = require('../routes/admin');
  app.use('/', publicRoutes);
  app.use('/admin', adminRoutes);

  return app;
}

describe('Web Portofolio Alvi - Integration Suite', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  test('GET / should respond with 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET /about should respond with 200 OK', async () => {
    const res = await request(app).get('/about');
    expect(res.statusCode).toBe(200);
  });

  test('GET /projects should respond with 200 OK', async () => {
    const res = await request(app).get('/projects');
    expect(res.statusCode).toBe(200);
  });

  test('GET /projects/:slug with valid slug should respond with 200 OK', async () => {
    const res = await request(app).get('/projects/valid-project');
    expect(res.statusCode).toBe(200);
  });

  test('GET /projects/:slug with invalid slug should respond with 404', async () => {
    const res = await request(app).get('/projects/unknown-slug');
    expect(res.statusCode).toBe(404);
  });

  test('GET /admin without auth should redirect to /admin/login', async () => {
    const res = await request(app).get('/admin');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/admin/login');
  });

  test('GET /robots.txt should contain Disallow: /admin', async () => {
    const res = await request(app).get('/robots.txt');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Disallow: /admin');
  });

  test('GET /cv should render a single-column ATS CV with a score from DB data', async () => {
    const res = await request(app).get('/cv');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Muhammad Alvi Kirana Zulfan Nazal');
    expect(res.text).toContain('ATS');
    expect(res.text).not.toContain('<img');
    expect(res.text).not.toContain('<table');
  });

  test('GET /cv.txt should return a plain-text attachment', async () => {
    const res = await request(app).get('/cv.txt');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.headers['content-disposition']).toContain('attachment');
    expect(res.text).toContain('MUHAMMAD ALVI KIRANA ZULFAN NAZAL');
  });

  test('GET /api/image-proxy with localhost URL should be rejected (SSRF protection)', async () => {
    const res = await request(app).get('/api/image-proxy?url=http://127.0.0.1:3005/admin');
    expect(res.statusCode).toBe(400);
  });
});
