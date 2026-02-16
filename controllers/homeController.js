const { Project, Skill, Profile, Contact, Certificate, Journey } = require('../models');

exports.home = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const projects = await Project.findAll({
      where: { is_featured: true },
      order: [['sort_order', 'ASC']],
      limit: 6
    });
    const skills = await Skill.findAll({ order: [['sort_order', 'ASC']] });
    
    // Fetch preview data for home page
    const certificates = await Certificate.findAll({ limit: 4, order: [['date', 'DESC']] });
    const journeys = await Journey.findAll({ limit: 4, order: [['date', 'DESC']] });

    res.render('home', {
      title: 'Home',
      profile: profile || {},
      projects,
      skills,
      certificates,
      journeys,
      currentPage: 'home'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', message: 'Server error' });
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
      currentPage: 'about'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', message: 'Server error' });
  }
};

exports.projects = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const projects = await Project.findAll({ order: [['sort_order', 'ASC']] });
    res.render('projects', {
      title: 'Projects',
      profile: profile || {},
      projects,
      currentPage: 'projects'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', message: 'Server error' });
  }
};

exports.projectDetail = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const project = await Project.findOne({ where: { slug: req.params.slug } });
    if (!project) return res.status(404).render('error', { title: 'Not Found', message: 'Project not found' });
    res.render('project-detail', {
      title: project.title,
      profile: profile || {},
      project,
      currentPage: 'projects'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', message: 'Server error' });
  }
};

exports.contact = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.render('contact', {
      title: 'Contact',
      profile: profile || {},
      currentPage: 'contact',
      success: req.query.success || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', message: 'Server error' });
  }
};


exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.redirect('/contact?error=Please fill in all required fields');
    }
    await Contact.create({ name, email, subject, message });
    res.redirect('/contact?success=Message sent successfully!');
  } catch (err) {
    console.error(err);
    res.redirect('/contact?error=Failed to send message');
  }
};

exports.certificates = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const certificates = await Certificate.findAll({ order: [['date', 'DESC']] });
    res.render('certificates', {
      title: 'Certifications',
      profile: profile || {},
      certificates,
      currentPage: 'certificates'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', message: 'Server error' });
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
      currentPage: 'journey'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', message: 'Server error' });
  }
};

