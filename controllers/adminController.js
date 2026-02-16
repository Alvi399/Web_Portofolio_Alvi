const bcrypt = require('bcryptjs');
const { User, Project, Skill, Contact, Profile } = require('../models');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');
const GitHubService = require('../services/github');

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
    req.session.userId = user.id;
    req.session.username = user.username;
    const returnTo = req.session.returnTo || '/admin';
    delete req.session.returnTo;
    res.redirect(returnTo);
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
    const [projectCount, skillCount, messageCount, unreadCount] = await Promise.all([
      Project.count(),
      Skill.count(),
      Contact.count(),
      Contact.count({ where: { is_read: false } })
    ]);
    res.render('admin/dashboard', {
      title: 'Dashboard',
      projectCount,
      skillCount,
      messageCount,
      unreadCount,
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

exports.projectCreate = (req, res) => {
  res.render('admin/projects/form', { title: 'Add Project', project: null, layout: 'layouts/admin' });
};

exports.projectStore = async (req, res) => {
  try {
    const { title, description, technologies, project_url, github_url, github_repo_name, stars, is_featured, sort_order } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const techArray = technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : [];
    await Project.create({
      title, slug, description,
      technologies: techArray,
      project_url: project_url || '',
      github_url: github_url || '',
      github_repo_name: github_repo_name || '',
      stars: parseInt(stars) || 0,
      is_featured: is_featured === 'on',
      sort_order: parseInt(sort_order) || 0,
      image: req.file ? '/uploads/' + req.file.filename : ''
    });
    res.redirect('/admin/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/projects/create?error=Failed to create project');
  }
};

exports.projectEdit = async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.redirect('/admin/projects');
  res.render('admin/projects/form', { title: 'Edit Project', project, layout: 'layouts/admin' });
};

exports.projectUpdate = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.redirect('/admin/projects');
    const { title, description, technologies, project_url, github_url, github_repo_name, stars, is_featured, sort_order } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const techArray = technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : [];
    await project.update({
      title, slug, description,
      technologies: techArray,
      project_url: project_url || '',
      github_url: github_url || '',
      github_repo_name: github_repo_name || '',
      stars: parseInt(stars) || 0,
      is_featured: is_featured === 'on',
      sort_order: parseInt(sort_order) || 0,
      image: req.file ? '/uploads/' + req.file.filename : project.image
    });
    res.redirect('/admin/projects');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/projects');
  }
};

exports.projectDelete = async (req, res) => {
  try {
    await Project.destroy({ where: { id: req.params.id } });
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

exports.skillStore = async (req, res) => {
  try {
    const { name, category, proficiency, icon, sort_order } = req.body;
    await Skill.create({
      name, category: category || 'General',
      proficiency: parseInt(proficiency) || 50,
      icon: icon || '',
      sort_order: parseInt(sort_order) || 0
    });
    res.redirect('/admin/skills');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/skills');
  }
};

exports.skillUpdate = async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) return res.redirect('/admin/skills');
    const { name, category, proficiency, icon, sort_order } = req.body;
    await skill.update({
      name, category: category || 'General',
      proficiency: parseInt(proficiency) || 50,
      icon: icon || '',
      sort_order: parseInt(sort_order) || 0
    });
    res.redirect('/admin/skills');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/skills');
  }
};

exports.skillDelete = async (req, res) => {
  try {
    await Skill.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/skills');
  } catch (err) {
    console.error(err);
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
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({ full_name: 'Your Name' });
    const { full_name, tagline, bio, email, phone, location, github_url, linkedin_url, resume_url } = req.body;
    await profile.update({
      full_name, tagline, bio, email, phone, location,
      github_url: github_url || '', linkedin_url: linkedin_url || '',
      resume_url: resume_url || '',
      profile_image: req.file ? '/uploads/' + req.file.filename : profile.profile_image
    });
    res.redirect('/admin/profile');
  } catch (err) {
    console.error(err);
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
    for (const repo of repos) {
      const existing = await Project.findOne({ where: { github_repo_name: repo.name } });
      if (!existing) {
        const slug = slugify(repo.name, { lower: true, strict: true });
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
          sort_order: 0
        });
        imported++;
      }
    }
    res.redirect('/admin/projects?imported=' + imported);
  } catch (err) {
    console.error(err);
    res.redirect('/admin/github?error=Import failed');
  }
};
