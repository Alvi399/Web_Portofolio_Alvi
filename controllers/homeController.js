const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const { Project, Skill, Profile, Contact, Certificate, Journey, Testimonial } = require('../models');
const { RESUME_DIR } = require('../helpers/fileUtils');
const { sendContactNotification } = require('../services/mailer');
const { trackEvent } = require('../services/analyticsService');
const { buildCv } = require('../services/cvService');

const renderError = (res, status, title, message) =>
  res.status(status).render('error', { title, message, currentPage: '' });

// Only published projects are visible to the public
const PUBLISHED = { status: 'published' };

exports.home = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const projects = await Project.findAll({
      where: { is_featured: true, ...PUBLISHED },
      order: [['sort_order', 'ASC']],
      limit: 3
    });
    const skills = await Skill.findAll({ order: [['sort_order', 'ASC']] });
    const topSkills = await Skill.findAll({
      order: [['proficiency', 'DESC'], ['sort_order', 'ASC']],
      limit: 5
    });
    // Technologies that appear in at least one published project (lowercased)
    const publishedProjects = await Project.findAll({ where: PUBLISHED, attributes: ['technologies'] });
    const usedTech = [...new Set(publishedProjects.flatMap(p =>
      (Array.isArray(p.technologies) ? p.technologies : []).map(t => String(t).trim().toLowerCase())
    ))];

    // Fetch preview data for home page (highlighted certificates preferred)
    let certificates = await Certificate.findAll({ where: { is_highlight: true }, limit: 4, order: [['date', 'DESC']] });
    if (!certificates || certificates.length === 0) {
      certificates = await Certificate.findAll({ limit: 4, order: [['date', 'DESC']] });
    }
    const journeys = await Journey.findAll({ limit: 4, order: [['date', 'DESC']] });
    const testimonials = await Testimonial.findAll({
      where: { is_visible: true },
      order: [['sort_order', 'ASC'], ['createdAt', 'DESC']],
      limit: 3
    });

    res.render('home', {
      title: 'Home',
      profile: profile || {},
      projects,
      skills,
      topSkills,
      usedTech,
      certificates,
      journeys,
      testimonials,
      currentPage: 'home',
      meta: { path: '/', type: 'website', jsonLd: true }
    });
  } catch (err) {
    console.error(err);
    renderError(res, 500, 'Error', 'Server error');
  }
};

exports.about = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const skills = await Skill.findAll({ order: [['category', 'ASC'], ['sort_order', 'ASC']] });
    const skillsByCategory = {};
    skills.forEach(s => {
      if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
      skillsByCategory[s.category].push(s);
    });
    res.render('about', {
      title: 'About',
      profile: profile || {},
      skillsByCategory,
      currentPage: 'about',
      meta: {
        path: '/about',
        description: 'Tentang saya: latar belakang, keahlian, dan jenis peran yang saya cari.'
      }
    });
  } catch (err) {
    console.error(err);
    renderError(res, 500, 'Error', 'Server error');
  }
};

exports.projects = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const selectedTech = (req.query.tech || '').trim();
    const searchQuery = (req.query.q || '').trim();

    // Fetch all published projects for seamless instant technology filtering
    const allPublished = await Project.findAll({
      where: PUBLISHED,
      order: [['sort_order', 'ASC'], ['createdAt', 'DESC']]
    });

    // Extract unique technologies used across all published projects
    const techSet = new Set();
    allPublished.forEach(p => {
      const techList = Array.isArray(p.technologies) ? p.technologies : [];
      techList.forEach(t => {
        if (t && String(t).trim()) {
          techSet.add(String(t).trim());
        }
      });
    });
    const usedTechnologies = Array.from(techSet).sort((a, b) => a.localeCompare(b));

    res.render('projects', {
      title: 'Projects',
      profile: profile || {},
      projects: allPublished,
      usedTechnologies,
      selectedTech,
      searchQuery,
      currentPage: 'projects',
      meta: {
        path: '/projects',
        description: 'Kumpulan project yang pernah saya bangun, lengkap dengan teknologi dan tautan kode.'
      }
    });
  } catch (err) {
    console.error(err);
    renderError(res, 500, 'Error', 'Server error');
  }
};


exports.projectDetail = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    // Draft projects are treated as not found for the public
    const project = await Project.findOne({ where: { slug: req.params.slug, ...PUBLISHED } });
    if (!project) return renderError(res, 404, 'Not Found', 'Project not found');
    trackEvent('project_view', project.slug, req);
    const plain = (project.description || '').replace(/\s+/g, ' ').trim();
    res.render('project-detail', {
      title: project.title,
      profile: profile || {},
      project,
      currentPage: 'projects',
      meta: {
        path: `/projects/${project.slug}`,
        description: plain.slice(0, 160) || `Detail project ${project.title}`,
        image: project.image || project.image || '',
        type: 'article'
      }
    });
  } catch (err) {
    console.error(err);
    renderError(res, 500, 'Error', 'Server error');
  }
};

// Read a JSON value stored via req.flash (returns fallback on any problem)
const readFlashJson = (req, key, fallback) => {
  const [raw] = req.flash(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch (e) { return fallback; }
};

exports.contact = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.render('contact', {
      title: 'Contact',
      profile: profile || {},
      currentPage: 'contact',
      success: req.flash('success')[0] || null,
      error: req.flash('error')[0] || null,
      fieldErrors: readFlashJson(req, 'fieldErrors', {}),
      old: readFlashJson(req, 'old', {}),
      meta: {
        path: '/contact',
        description: 'Hubungi saya lewat email, LinkedIn, WhatsApp, atau formulir kontak.'
      }
    });
  } catch (err) {
    console.error(err);
    renderError(res, 500, 'Error', 'Server error');
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.submitContact = async (req, res) => {
  const body = req.body || {};

  // Honeypot anti-spam check (T-22)
  if (body.website && String(body.website).trim() !== '') {
    req.flash('success', 'Pesan Anda berhasil dikirim. Terima kasih!');
    return res.redirect('/contact');
  }

  const old = {
    name: String(body.name || '').trim(),
    email: String(body.email || '').trim(),
    subject: String(body.subject || '').trim(),
    message: String(body.message || '').trim()
  };

  // Server-side validation (per-field messages)
  const fieldErrors = {};
  if (!old.name) fieldErrors.name = 'Nama wajib diisi.';
  else if (old.name.length > 100) fieldErrors.name = 'Nama maksimal 100 karakter.';
  if (!old.email) fieldErrors.email = 'Email wajib diisi.';
  else if (old.email.length > 150 || !EMAIL_RE.test(old.email)) fieldErrors.email = 'Format email tidak valid.';
  if (old.subject.length > 150) fieldErrors.subject = 'Subjek maksimal 150 karakter.';
  if (!old.message) fieldErrors.message = 'Pesan wajib diisi.';
  else if (old.message.length > 3000) fieldErrors.message = 'Pesan maksimal 3000 karakter.';

  if (Object.keys(fieldErrors).length) {
    req.flash('error', 'Mohon periksa kembali isian formulir.');
    req.flash('fieldErrors', JSON.stringify(fieldErrors));
    req.flash('old', JSON.stringify(old));
    return res.redirect('/contact');
  }

  try {
    // Persist first; email must never block or fail the visitor's request
    const contact = await Contact.create(old);
    sendContactNotification(contact, res.locals.siteUrl).catch(() => {});
    req.flash('success', 'Pesan Anda berhasil dikirim. Terima kasih!');
    res.redirect('/contact');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal mengirim pesan. Silakan coba lagi.');
    req.flash('old', JSON.stringify(old));
    res.redirect('/contact');
  }
};

exports.certificates = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 12;
    const offset = (page - 1) * limit;
    
    const profile = await Profile.findOne();
    const { count, rows: certificates } = await Certificate.findAndCountAll({
      order: [['date', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.max(1, Math.ceil(count / limit));
    
    res.render('certificates', {
      title: 'Certifications',
      profile: profile || {},
      certificates,
      currentPage: 'certificates',
      pagination: {
        page,
        totalPages,
        totalItems: count
      },
      meta: { path: '/certificates', description: 'Sertifikasi dan pelatihan yang telah saya selesaikan.' }
    });
  } catch (err) {
    console.error(err);
    renderError(res, 500, 'Error', 'Server error');
  }
};

exports.journey = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const journeys = await Journey.findAll({ order: [['date', 'DESC']] });
    res.render('journey', {
      title: 'My Journey',
      profile: profile || {},
      journeys,
      currentPage: 'journey',
      meta: { path: '/journey', description: 'Perjalanan pendidikan dan karir saya.' }
    });
  } catch (err) {
    console.error(err);
    renderError(res, 500, 'Error', 'Server error');
  }
};

// GET /resume - download the uploaded CV, fall back to external URL, else 404
exports.resume = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    trackEvent('cv_download', null, req);
    if (profile && profile.resume_file) {
      const filePath = path.join(RESUME_DIR, path.basename(profile.resume_file));
      if (fs.existsSync(filePath)) {
        const nameSlug = slugify(profile.full_name || 'CV', { lower: false, strict: true }) || 'CV';
        return res.download(filePath, `CV-${nameSlug}.pdf`);
      }
    }
    if (profile && profile.resume_url) return res.redirect(profile.resume_url);
    return renderError(res, 404, 'Not Found', 'CV belum tersedia.');
  } catch (err) {
    console.error(err);
    renderError(res, 500, 'Error', 'Server error');
  }
};

// GET /cv - ATS-friendly CV generated live from portfolio data (print to PDF in browser)
exports.cv = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const { cv, score } = await buildCv(res.locals.lang);
    res.render('cv', {
      layout: false,
      title: 'CV',
      profile: profile || {},
      cv,
      score,
      meta: { path: '/cv', description: 'CV ATS-friendly yang dibuat otomatis dari data portofolio.' }
    });
  } catch (err) {
    console.error(err);
    renderError(res, 500, 'Error', 'Server error');
  }
};

// GET /cv.txt - plain-text CV (safest format for ATS text parsers)
exports.cvText = async (req, res) => {
  try {
    const { cv, text } = await buildCv(res.locals.lang);
    const nameSlug = slugify(cv.name || 'CV', { lower: false, strict: true }) || 'CV';
    res.set('Content-Disposition', `attachment; filename="CV-${nameSlug}.txt"`);
    res.type('text/plain; charset=utf-8').send(text);
  } catch (err) {
    console.error(err);
    res.status(500).type('text/plain').send('Server error');
  }
};

// POST /api/track-event
exports.trackEventApi = async (req, res) => {
  try {
    const { eventType, targetId } = req.body || {};
    if (eventType) {
      await trackEvent(eventType, targetId, req);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to track event' });
  }
};

// GET /sitemap.xml
exports.sitemap = async (req, res) => {
  try {
    const base = res.locals.siteUrl;
    const staticPaths = ['/', '/about', '/projects', '/certificates', '/journey', '/contact'];
    const projects = await Project.findAll({ where: PUBLISHED, attributes: ['slug', 'updatedAt'] });
    const urls = staticPaths.map(p => `  <url><loc>${base}${p}</loc></url>`);
    projects.forEach(p => {
      urls.push(`  <url><loc>${base}/projects/${encodeURIComponent(p.slug)}</loc><lastmod>${new Date(p.updatedAt).toISOString()}</lastmod></url>`);
    });
    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
    );
  } catch (err) {
    console.error(err);
    res.status(500).type('text/plain').send('Server error');
  }
};

// GET /robots.txt
exports.robots = (req, res) => {
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${res.locals.siteUrl}/sitemap.xml\n`
  );
};

// GET /testimonial
exports.testimonialForm = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const success = req.flash('success')[0] || null;
    const error = req.flash('error')[0] || null;
    const oldRaw = req.flash('old')[0];
    const old = oldRaw ? JSON.parse(oldRaw) : {};
    const fieldErrorsRaw = req.flash('fieldErrors')[0];
    const fieldErrors = fieldErrorsRaw ? JSON.parse(fieldErrorsRaw) : {};

    res.render('testimonial-form', {
      title: 'Beri Testimoni & Rekomendasi',
      profile: profile || {},
      success,
      error,
      old,
      fieldErrors,
      currentPage: 'testimonial',
      meta: {
        path: '/testimonial',
        description: 'Formulir pemberian testimoni dan rekomendasi profesional untuk portofolio.'
      }
    });
  } catch (err) {
    console.error(err);
    renderError(res, 500, 'Error', 'Server error');
  }
};

// POST /testimonial
exports.submitTestimonial = async (req, res) => {
  const { name, position, company, relationship, quote } = req.body;
  const old = { name, position, company, relationship, quote };
  const fieldErrors = {};

  if (!name || name.trim().length < 2) {
    fieldErrors.name = 'Nama lengkap wajib diisi (minimal 2 karakter).';
  }
  if (!quote || quote.trim().length < 10) {
    fieldErrors.quote = 'Kata testimoni / rekomendasi wajib diisi (minimal 10 karakter).';
  }

  if (Object.keys(fieldErrors).length > 0) {
    req.flash('error', 'Mohon periksa kembali isian formulir.');
    req.flash('fieldErrors', JSON.stringify(fieldErrors));
    req.flash('old', JSON.stringify(old));
    return res.redirect('/testimonial');
  }

  try {
    let photoUrl = '';
    if (req.file) {
      photoUrl = `/uploads/testimonials/${req.file.filename}`;
    }

    let finalPosition = (position || '').trim();
    if (relationship && relationship.trim()) {
      if (finalPosition) {
        finalPosition = `${finalPosition} (${relationship.trim()})`;
      } else {
        finalPosition = relationship.trim();
      }
    }

    await Testimonial.create({
      name: name.trim(),
      position: finalPosition,
      company: (company || '').trim(),
      quote: quote.trim(),
      photo: photoUrl,
      is_visible: true,
      sort_order: 0
    });

    req.flash('success', 'Terima kasih banyak! Testimoni & rekomendasi Anda berhasil dikirim dan terintegrasi langsung dengan portofolio.');
    res.redirect('/testimonial');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal menyimpan testimoni. Silakan coba beberapa saat lagi.');
    req.flash('old', JSON.stringify(old));
    res.redirect('/testimonial');
  }
};


