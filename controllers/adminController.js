const bcrypt = require('bcryptjs');
const { User, Project, Skill, Contact, Profile, Certificate, Journey, Testimonial } = require('../models');

const slugify = require('slugify');
const path = require('path');
const fs = require('fs');
const GitHubService = require('../services/github');
const { uniqueSlug } = require('../helpers/slugUtils');
const { RESUME_DIR, UPLOADS_DIR, removeFileInside, isPdfFile, isImageFile } = require('../helpers/fileUtils');
const { getAnalyticsSummary } = require('../services/analyticsService');

// --- Auth ---
exports.loginPage = (req, res) => {
  if (req.session.userId) return res.redirect('/admin');
  res.render('admin/login', { title: 'Admin Login', error: req.query.error || null, layout: false });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.redirect('/admin/login?error=Invalid credentials');
    }
    req.session.regenerate((err) => {
      if (err) console.error('Session regenerate error:', err);
      req.session.userId = user.id;
      req.session.username = user.username;
      const returnTo = req.session.returnTo || '/admin';
      delete req.session.returnTo;
      res.redirect(returnTo);
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/login?error=Login failed');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
};

// --- Dashboard ---
exports.dashboard = async (req, res) => {
  try {
    const [
      projectCount,
      draftProjectCount,
      skillCount,
      messageCount,
      unreadCount,
      certificateCount,
      journeyCount,
      testimonialCount,
      profile,
      analytics
    ] = await Promise.all([
      Project.count(),
      Project.count({ where: { status: 'draft' } }),
      Skill.count(),
      Contact.count(),
      Contact.count({ where: { is_read: false } }),
      Certificate.count(),
      Journey.count(),
      Testimonial.count(),
      Profile.findOne(),
      getAnalyticsSummary()
    ]);

    // Calculate profile completeness score (0-100%)
    let score = 0;
    const checks = [];
    if (profile) {
      if (profile.display_name || profile.full_name) { score += 25; checks.push({ name: 'Nama & Display Name', done: true }); }
      else checks.push({ name: 'Nama & Display Name', done: false });

      if (profile.headline) { score += 25; checks.push({ name: 'Headline / Role', done: true }); }
      else checks.push({ name: 'Headline / Role', done: false });

      if (profile.profile_image) { score += 25; checks.push({ name: 'Foto Profil', done: true }); }
      else checks.push({ name: 'Foto Profil', done: false });

      if (profile.about_summary) { score += 25; checks.push({ name: 'Ringkasan About', done: true }); }
      else checks.push({ name: 'Ringkasan About', done: false });
    }

    res.render('admin/dashboard', {
      title: 'Dashboard',
      projectCount,
      draftProjectCount,
      skillCount,
      messageCount,
      unreadCount,
      certificateCount,
      journeyCount,
      testimonialCount,
      profileCompleteness: score,
      profileChecks: checks,
      analytics,
      layout: 'layouts/admin'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// --- Projects CRUD ---
exports.projectsList = async (req, res) => {
  const projects = await Project.findAll({ order: [['sort_order', 'ASC']] });
  res.render('admin/projects/index', { title: 'Manage Projects', projects, layout: 'layouts/admin' });
};

exports.reorderProjects = async (req, res) => {
  try {
    const { items } = req.body || {};
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.id && item.sort_order != null) {
          await Project.update({ sort_order: parseInt(item.sort_order, 10) }, { where: { id: item.id } });
        }
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder projects' });
  }
};

exports.reorderSkills = async (req, res) => {
  try {
    const { items } = req.body || {};
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.id && item.sort_order != null) {
          await Skill.update({ sort_order: parseInt(item.sort_order, 10) }, { where: { id: item.id } });
        }
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder skills' });
  }
};

exports.projectCreate = async (req, res) => {
  const skills = await Skill.findAll({ order: [['name', 'ASC']] });
  res.render('admin/projects/form', { title: 'Add Project', project: null, skills, layout: 'layouts/admin' });
};

exports.projectStore = async (req, res) => {
  try {
    if (req.file && !isImageFile(req.file.path)) {
      removeFileInside(UPLOADS_DIR, req.file.filename);
      req.flash('error', 'Format gambar tidak valid. Hanya file JPEG, PNG, GIF, dan WebP yang diizinkan.');
      return res.redirect('/admin/projects/create');
    }
    const { title, description, technologies, project_url, github_url, github_repo_name, stars, is_featured, sort_order, image, problem, role, impact, demo_url, status, description_en, problem_en, role_en, impact_en } = req.body;
    const slug = await uniqueSlug(Project, title);
    const techArray = Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : []);
    await Project.create({
      title, slug, description,
      technologies: techArray,
      project_url: project_url || '',
      github_url: github_url || '',
      github_repo_name: github_repo_name || '',
      stars: parseInt(stars) || 0,
      is_featured: is_featured === 'on',
      sort_order: parseInt(sort_order) || 0,
      image: req.file ? '/uploads/' + req.file.filename : (image || ''),
      problem: problem || null,
      role: role || null,
      impact: impact || null,
      demo_url: demo_url || null,
      status: status === 'draft' ? 'draft' : 'published',
      description_en: description_en || null,
      problem_en: problem_en || null,
      role_en: role_en || null,
      impact_en: impact_en || null
    });
    res.redirect('/admin/projects');
  } catch (err) {
    console.error(err);
    if (req.file) removeFileInside(UPLOADS_DIR, req.file.filename);
    res.redirect('/admin/projects/create?error=Failed to create project');
  }
};

exports.projectEdit = async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.redirect('/admin/projects');
  const skills = await Skill.findAll({ order: [['name', 'ASC']] });
  res.render('admin/projects/form', { title: 'Edit Project', project, skills, layout: 'layouts/admin' });
};

exports.projectUpdate = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.redirect('/admin/projects');

    if (req.file && !isImageFile(req.file.path)) {
      removeFileInside(UPLOADS_DIR, req.file.filename);
      req.flash('error', 'Format gambar tidak valid. Hanya file JPEG, PNG, GIF, dan WebP yang diizinkan.');
      return res.redirect(`/admin/projects/${project.id}/edit`);
    }

    const oldImage = project.image;
    const { title, description, technologies, project_url, github_url, github_repo_name, stars, is_featured, sort_order, image, problem, role, impact, demo_url, status, description_en, problem_en, role_en, impact_en } = req.body;
    // Keep the existing slug (stable URLs) unless the title changed
    const slug = project.title === title ? project.slug : await uniqueSlug(Project, title, project.id);
    const techArray = Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : []);
    await project.update({
      title, slug, description,
      technologies: techArray,
      project_url: project_url || '',
      github_url: github_url || '',
      github_repo_name: github_repo_name || '',
      stars: parseInt(stars) || 0,
      is_featured: is_featured === 'on',
      sort_order: parseInt(sort_order) || 0,
      image: req.file ? '/uploads/' + req.file.filename : (image || project.image),
      problem: problem || null,
      role: role || null,
      impact: impact || null,
      demo_url: demo_url || null,
      status: status === 'draft' ? 'draft' : 'published',
      description_en: description_en || null,
      problem_en: problem_en || null,
      role_en: role_en || null,
      impact_en: impact_en || null
    });

    if (req.file && oldImage && oldImage !== project.image) {
      removeFileInside(UPLOADS_DIR, oldImage);
    }

    res.redirect('/admin/projects');
  } catch (err) {
    console.error(err);
    if (req.file) removeFileInside(UPLOADS_DIR, req.file.filename);
    res.redirect('/admin/projects');
  }
};

exports.projectDelete = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (project) {
      if (project.image) removeFileInside(UPLOADS_DIR, project.image);
      await project.destroy();
    }
    res.redirect('/admin/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/projects');
  }
};

// --- Skills CRUD ---
exports.skillsList = async (req, res) => {
  const skills = await Skill.findAll({ order: [['category', 'ASC'], ['sort_order', 'ASC']] });
  res.render('admin/skills/index', { title: 'Manage Skills', skills, layout: 'layouts/admin' });
};

exports.skillCreate = (req, res) => {
  res.render('admin/skills/form', { title: 'Add Skill', skill: null, layout: 'layouts/admin' });
};

exports.skillEdit = async (req, res) => {
  const skill = await Skill.findByPk(req.params.id);
  if (!skill) return res.redirect('/admin/skills');
  res.render('admin/skills/form', { title: 'Edit Skill', skill, layout: 'layouts/admin' });
};

exports.skillStore = async (req, res) => {
  try {
    const { name, category, proficiency, icon, image, sort_order } = req.body;
    const newSkill = await Skill.create({
      name: name ? name.trim() : '',
      category: category || 'General',
      proficiency: parseInt(proficiency, 10) || 50,
      icon: icon ? icon.trim() : '',
      image: image ? image.trim() : '',
      sort_order: parseInt(sort_order, 10) || 0
    });
    req.flash('success', `Skill "${newSkill.name}" berhasil ditambahkan.`);
    res.redirect('/admin/skills');
  } catch (err) {
    console.error('skillStore error:', err);
    req.flash('error', 'Gagal menyimpan skill: ' + err.message);
    res.redirect('/admin/skills');
  }
};

exports.skillUpdate = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) {
      req.flash('error', 'Skill tidak ditemukan.');
      return res.redirect('/admin/skills');
    }
    const { name, category, proficiency, icon, image, sort_order } = req.body;
    await skill.update({
      name: name ? name.trim() : skill.name,
      category: category || skill.category || 'General',
      proficiency: proficiency !== undefined ? (parseInt(proficiency, 10) || 50) : skill.proficiency,
      icon: icon !== undefined ? icon.trim() : skill.icon,
      image: image !== undefined ? image.trim() : skill.image,
      sort_order: sort_order !== undefined ? (parseInt(sort_order, 10) || 0) : skill.sort_order
    });
    req.flash('success', `Skill "${skill.name}" berhasil diperbarui di database!`);
    res.redirect('/admin/skills');
  } catch (err) {
    console.error('skillUpdate error:', err);
    req.flash('error', 'Gagal memperbarui skill: ' + err.message);
    res.redirect('/admin/skills');
  }
};

exports.skillDelete = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (skill) {
      await skill.destroy();
      req.flash('success', 'Skill berhasil dihapus.');
    }
    res.redirect('/admin/skills');
  } catch (err) {
    console.error('skillDelete error:', err);
    req.flash('error', 'Gagal menghapus skill: ' + err.message);
    res.redirect('/admin/skills');
  }
};

// --- Contacts ---
exports.contactsList = async (req, res) => {
  const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/contacts/index', { title: 'Messages', contacts, layout: 'layouts/admin' });
};

exports.contactShow = async (req, res) => {
  const contact = await Contact.findByPk(req.params.id);
  if (!contact) return res.redirect('/admin/contacts');
  if (!contact.is_read) await contact.update({ is_read: true });
  res.render('admin/contacts/show', { title: 'View Message', contact, layout: 'layouts/admin' });
};

exports.contactDelete = async (req, res) => {
  try {
    await Contact.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/contacts');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/contacts');
  }
};

// --- Profile ---
exports.profileEdit = async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({ full_name: 'Your Name' });
  res.render('admin/profile/edit', { title: 'Edit Profile', profile, layout: 'layouts/admin' });
};

exports.profileUpdate = async (req, res) => {
  const uploaded = req.files || {};
  const newImage = uploaded.profile_image && uploaded.profile_image[0];
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({ full_name: 'Your Name' });
    const {
      full_name, display_name, tagline, bio, email, phone, location, github_url, linkedin_url,
      headline, availability_status, work_preference, whatsapp, about_summary, looking_for,
      headline_en, work_preference_en, about_summary_en, looking_for_en, bio_en
    } = req.body;

    const oldImage = profile.profile_image;
    if (newImage) {
      if (!isImageFile(newImage.path)) {
        removeFileInside(UPLOADS_DIR, newImage.filename);
        req.flash('error', 'Format gambar profil tidak valid.');
        return res.redirect('/admin/profile');
      }
    }

    const update = {
      full_name,
      display_name: display_name ? display_name.trim().slice(0, 40) : null,
      tagline, bio, email, phone, location,
      github_url: github_url || '', linkedin_url: linkedin_url || '',
      headline: headline ? headline.trim().slice(0, 120) : null,
      availability_status: ['open_to_work', 'freelance', 'not_available'].includes(availability_status) ? availability_status : 'open_to_work',
      work_preference: work_preference ? work_preference.trim().slice(0, 60) : null,
      whatsapp: whatsapp ? whatsapp.replace(/\D/g, '').slice(0, 30) || null : null,
      about_summary: about_summary ? about_summary.trim() : null,
      looking_for: looking_for ? looking_for.trim() : null,
      headline_en: headline_en ? headline_en.trim().slice(0, 120) : null,
      work_preference_en: work_preference_en ? work_preference_en.trim().slice(0, 60) : null,
      about_summary_en: about_summary_en ? about_summary_en.trim() : null,
      looking_for_en: looking_for_en ? looking_for_en.trim() : null,
      bio_en: bio_en || null,
      profile_image: newImage ? '/uploads/' + newImage.filename : profile.profile_image
    };

    await profile.update(update);

    if (newImage && oldImage && oldImage !== update.profile_image) {
      removeFileInside(UPLOADS_DIR, oldImage);
    }
    req.flash('success', 'Profil berhasil disimpan.');
    res.redirect('/admin/profile');
  } catch (err) {
    console.error(err);
    if (newImage) removeFileInside(UPLOADS_DIR, newImage.filename);
    req.flash('error', 'Gagal menyimpan profil.');
    res.redirect('/admin/profile');
  }
};

// --- GitHub Import ---
exports.githubImportPage = (req, res) => {
  res.render('admin/github/import', {
    title: 'Import from GitHub',
    repos: null,
    username: '',
    error: null,
    layout: 'layouts/admin'
  });
};

exports.githubFetch = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.render('admin/github/import', {
        title: 'Import from GitHub', repos: null, username: '', error: 'Please enter a GitHub username', layout: 'layouts/admin'
      });
    }
    const repos = await GitHubService.fetchUserRepos(username);
    res.render('admin/github/import', {
      title: 'Import from GitHub', repos, username, error: null, layout: 'layouts/admin'
    });
  } catch (err) {
    res.render('admin/github/import', {
      title: 'Import from GitHub', repos: null, username: req.body.username || '', error: err.message, layout: 'layouts/admin'
    });
  }
};

exports.githubImport = async (req, res) => {
  try {
    const repos = JSON.parse(req.body.repos || '[]');
    let imported = 0;
    let skipped = 0;
    for (const repo of repos) {
      const existing = await Project.findOne({ where: { github_repo_name: repo.name } });
      if (existing) {
        skipped++;
        continue;
      }
      const slug = await uniqueSlug(Project, repo.name);
      await Project.create({
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        slug,
        description: repo.description || '',
        technologies: repo.language ? [repo.language, ...(repo.topics || [])] : (repo.topics || []),
        project_url: repo.homepage || '',
        github_url: repo.html_url,
        github_repo_name: repo.name,
        stars: repo.stargazers_count || 0,
        is_featured: false,
        sort_order: 0,
        // Imported repos stay hidden until the admin reviews and publishes them
        status: 'draft'
      });
      imported++;
    }
    req.flash('success', `${imported} project diimpor (draft), ${skipped} dilewati karena sudah ada.`);
    res.redirect('/admin/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/github?error=Import failed');
  }
};

// --- Certificates CRUD ---
exports.certificatesList = async (req, res) => {
  try {
    const certificates = await Certificate.findAll({ order: [['date', 'DESC']] });
    res.render('admin/certificates/index', { title: 'Manage Certificates', certificates, layout: 'layouts/admin' });
  } catch (err) {
    console.error('certificatesList error:', err);
    res.render('admin/certificates/index', { title: 'Manage Certificates', certificates: [], layout: 'layouts/admin' });
  }
};

exports.certificateCreate = (req, res) => {
  res.render('admin/certificates/form', { title: 'Add Certificate', certificate: null, layout: 'layouts/admin' });
};

exports.certificateEdit = async (req, res) => {
  const certificate = await Certificate.findByPk(req.params.id);
  if (!certificate) return res.redirect('/admin/certificates');
  res.render('admin/certificates/form', { title: 'Edit Certificate', certificate, layout: 'layouts/admin' });
};

exports.certificateStore = async (req, res) => {
  try {
    const { title, issuer, date, credential_url, category, is_highlight } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : (req.body.image ? req.body.image.trim() : '');
    const cert = await Certificate.create({
      title: title ? title.trim() : '',
      issuer: issuer ? issuer.trim() : '',
      date: date || new Date().toISOString().substring(0, 10),
      credential_url: credential_url ? credential_url.trim() : '',
      image,
      category: category || 'Other',
      is_highlight: is_highlight === 'on' || is_highlight === 'true' || is_highlight === true
    });
    req.flash('success', `Sertifikat "${cert.title}" berhasil ditambahkan ke database.`);
    res.redirect('/admin/certificates');
  } catch (err) {
    console.error('certificateStore error:', err);
    if (req.file) removeFileInside(UPLOADS_DIR, req.file.filename);
    req.flash('error', 'Gagal menyimpan sertifikat: ' + err.message);
    res.redirect('/admin/certificates');
  }
};

exports.certificateUpdate = async (req, res) => {
  try {
    const cert = await Certificate.findByPk(req.params.id);
    if (!cert) {
      req.flash('error', 'Sertifikat tidak ditemukan.');
      return res.redirect('/admin/certificates');
    }
    const { title, issuer, date, credential_url, category, is_highlight } = req.body;
    const oldImage = cert.image;
    const newImage = req.file ? '/uploads/' + req.file.filename : (req.body.image !== undefined ? req.body.image.trim() : cert.image);

    await cert.update({
      title: title ? title.trim() : cert.title,
      issuer: issuer ? issuer.trim() : cert.issuer,
      date: date || cert.date,
      credential_url: credential_url !== undefined ? credential_url.trim() : cert.credential_url,
      image: newImage,
      category: category || cert.category || 'Other',
      is_highlight: is_highlight === 'on' || is_highlight === 'true' || is_highlight === true
    });

    if (req.file && oldImage && oldImage !== newImage) {
      removeFileInside(UPLOADS_DIR, oldImage);
    }

    req.flash('success', `Sertifikat "${cert.title}" berhasil diperbarui di database!`);
    res.redirect('/admin/certificates');
  } catch (err) {
    console.error('certificateUpdate error:', err);
    if (req.file) removeFileInside(UPLOADS_DIR, req.file.filename);
    req.flash('error', 'Gagal memperbarui sertifikat: ' + err.message);
    res.redirect('/admin/certificates');
  }
};

exports.certificateDelete = async (req, res) => {
  try {
    const cert = await Certificate.findByPk(req.params.id);
    if (cert) {
      if (cert.image) removeFileInside(UPLOADS_DIR, cert.image);
      await cert.destroy();
      req.flash('success', 'Sertifikat berhasil dihapus dari database.');
    }
    res.redirect('/admin/certificates');
  } catch (err) {
    console.error('certificateDelete error:', err);
    req.flash('error', 'Gagal menghapus sertifikat: ' + err.message);
    res.redirect('/admin/certificates');
  }
};

// --- Journey CRUD ---
exports.journeyList = async (req, res) => {
  try {
    const journeys = await Journey.findAll({ order: [['date', 'DESC']] });
    res.render('admin/journey/index', { title: 'Manage Journey', journeys, layout: 'layouts/admin' });
  } catch (err) {
    console.error('journeyList error:', err);
    res.render('admin/journey/index', { title: 'Manage Journey', journeys: [], layout: 'layouts/admin' });
  }
};

exports.journeyCreate = (req, res) => {
  res.render('admin/journey/form', { title: 'Add Journey Event', item: null, layout: 'layouts/admin' });
};

exports.journeyEdit = async (req, res) => {
  const item = await Journey.findByPk(req.params.id);
  if (!item) return res.redirect('/admin/journey');
  res.render('admin/journey/form', { title: 'Edit Journey Event', item, layout: 'layouts/admin' });
};

exports.journeyStore = async (req, res) => {
  try {
    const { title, description, date, end_date, is_current, category, title_en, description_en } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : (req.body.image ? req.body.image.trim() : '');
    const isCurrent = is_current === 'on' || is_current === 'true' || is_current === true;
    const item = await Journey.create({
      title: title ? title.trim() : '',
      description: description ? description.trim() : '',
      date: date || new Date().toISOString().substring(0, 10),
      end_date: isCurrent ? null : (end_date || null),
      is_current: isCurrent,
      image,
      category: category || 'experience',
      title_en: title_en ? title_en.trim() : null,
      description_en: description_en ? description_en.trim() : null
    });
    req.flash('success', `Journey event "${item.title}" berhasil ditambahkan.`);
    res.redirect('/admin/journey');
  } catch (err) {
    console.error('journeyStore error:', err);
    if (req.file) removeFileInside(UPLOADS_DIR, req.file.filename);
    req.flash('error', 'Gagal menyimpan journey: ' + err.message);
    res.redirect('/admin/journey');
  }
};

exports.journeyUpdate = async (req, res) => {
  try {
    const item = await Journey.findByPk(req.params.id);
    if (!item) {
      req.flash('error', 'Data journey tidak ditemukan.');
      return res.redirect('/admin/journey');
    }
    const { title, description, date, end_date, is_current, category, title_en, description_en } = req.body;
    const oldImage = item.image;
    const newImage = req.file ? '/uploads/' + req.file.filename : (req.body.image !== undefined ? req.body.image.trim() : item.image);
    const isCurrent = is_current === 'on' || is_current === 'true' || is_current === true;

    await item.update({
      title: title ? title.trim() : item.title,
      description: description !== undefined ? description.trim() : item.description,
      date: date || item.date,
      end_date: isCurrent ? null : (end_date || null),
      is_current: isCurrent,
      image: newImage,
      category: category || item.category || 'experience',
      title_en: title_en !== undefined ? (title_en ? title_en.trim() : null) : item.title_en,
      description_en: description_en !== undefined ? (description_en ? description_en.trim() : null) : item.description_en
    });

    if (req.file && oldImage && oldImage !== newImage) {
      removeFileInside(UPLOADS_DIR, oldImage);
    }

    req.flash('success', `Journey "${item.title}" berhasil diperbarui di database!`);
    res.redirect('/admin/journey');
  } catch (err) {
    console.error('journeyUpdate error:', err);
    if (req.file) removeFileInside(UPLOADS_DIR, req.file.filename);
    req.flash('error', 'Gagal memperbarui journey: ' + err.message);
    res.redirect('/admin/journey');
  }
};

exports.journeyDelete = async (req, res) => {
  try {
    const item = await Journey.findByPk(req.params.id);
    if (item) {
      if (item.image) removeFileInside(UPLOADS_DIR, item.image);
      await item.destroy();
      req.flash('success', 'Journey event berhasil dihapus dari database.');
    }
    res.redirect('/admin/journey');
  } catch (err) {
    console.error('journeyDelete error:', err);
    req.flash('error', 'Gagal menghapus journey: ' + err.message);
    res.redirect('/admin/journey');
  }
};

// --- Testimonials CRUD ---
exports.testimonialsList = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({ order: [['sort_order', 'ASC'], ['createdAt', 'DESC']] });
    res.render('admin/testimonials/index', { title: 'Manage Testimonials', testimonials, layout: 'layouts/admin' });
  } catch (err) {
    console.error('testimonialsList error:', err);
    res.render('admin/testimonials/index', { title: 'Manage Testimonials', testimonials: [], layout: 'layouts/admin' });
  }
};

exports.testimonialCreate = (req, res) => {
  res.render('admin/testimonials/form', { title: 'Add Testimonial', item: null, layout: 'layouts/admin' });
};

exports.testimonialEdit = async (req, res) => {
  const item = await Testimonial.findByPk(req.params.id);
  if (!item) return res.redirect('/admin/testimonials');
  res.render('admin/testimonials/form', { title: 'Edit Testimonial', item, layout: 'layouts/admin' });
};

exports.testimonialStore = async (req, res) => {
  try {
    const { name, position, company, quote, is_visible, sort_order } = req.body;
    const photo = req.file ? '/uploads/' + req.file.filename : (req.body.image ? req.body.image.trim() : '');
    const item = await Testimonial.create({
      name: name ? name.trim() : '',
      position: position ? position.trim() : '',
      company: company ? company.trim() : '',
      quote: quote ? quote.trim() : '',
      photo,
      is_visible: is_visible === 'on' || is_visible === 'true' || is_visible === true,
      sort_order: parseInt(sort_order, 10) || 0
    });
    req.flash('success', `Testimonial dari "${item.name}" berhasil ditambahkan.`);
    res.redirect('/admin/testimonials');
  } catch (err) {
    console.error('testimonialStore error:', err);
    if (req.file) removeFileInside(UPLOADS_DIR, req.file.filename);
    req.flash('error', 'Gagal menyimpan testimonial: ' + err.message);
    res.redirect('/admin/testimonials');
  }
};

exports.testimonialUpdate = async (req, res) => {
  try {
    const item = await Testimonial.findByPk(req.params.id);
    if (!item) {
      req.flash('error', 'Testimonial tidak ditemukan.');
      return res.redirect('/admin/testimonials');
    }
    const { name, position, company, quote, is_visible, sort_order } = req.body;
    const oldPhoto = item.photo;
    const newPhoto = req.file ? '/uploads/' + req.file.filename : (req.body.image !== undefined ? req.body.image.trim() : item.photo);

    await item.update({
      name: name ? name.trim() : item.name,
      position: position !== undefined ? position.trim() : item.position,
      company: company !== undefined ? company.trim() : item.company,
      quote: quote !== undefined ? quote.trim() : item.quote,
      photo: newPhoto,
      is_visible: is_visible === 'on' || is_visible === 'true' || is_visible === true,
      sort_order: sort_order !== undefined ? (parseInt(sort_order, 10) || 0) : item.sort_order
    });

    if (req.file && oldPhoto && oldPhoto !== newPhoto) {
      removeFileInside(UPLOADS_DIR, oldPhoto);
    }

    req.flash('success', `Testimonial dari "${item.name}" berhasil diperbarui di database!`);
    res.redirect('/admin/testimonials');
  } catch (err) {
    console.error('testimonialUpdate error:', err);
    if (req.file) removeFileInside(UPLOADS_DIR, req.file.filename);
    req.flash('error', 'Gagal memperbarui testimonial: ' + err.message);
    res.redirect('/admin/testimonials');
  }
};

exports.testimonialDelete = async (req, res) => {
  try {
    const item = await Testimonial.findByPk(req.params.id);
    if (item) {
      if (item.photo) removeFileInside(UPLOADS_DIR, item.photo);
      await item.destroy();
      req.flash('success', 'Testimonial berhasil dihapus dari database.');
    }
    res.redirect('/admin/testimonials');
  } catch (err) {
    console.error('testimonialDelete error:', err);
    req.flash('error', 'Gagal menghapus testimonial: ' + err.message);
    res.redirect('/admin/testimonials');
  }
};
