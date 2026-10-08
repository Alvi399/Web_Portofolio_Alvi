const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sequelize, Profile, Project, Skill, User } = require('../models');

// DESTRUCTIVE: drops and recreates all tables. Guarded (see below).
async function seed() {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
      console.error('Refusing to seed: NODE_ENV=production. Set ALLOW_SEED=true to override (this ERASES all data).');
      process.exit(1);
    }

    await sequelize.authenticate();

    // Refuse to wipe a database that already has data unless --force is given
    const force = process.argv.includes('--force');
    let hasData = false;
    try {
      const [users, projects] = await Promise.all([User.count(), Project.count()]);
      hasData = users > 0 || projects > 0;
    } catch (e) {
      hasData = false; // tables do not exist yet
    }
    if (hasData && !force) {
      console.error('Database already contains data. Seeding would DELETE it. Re-run with --force to confirm: npm run seed -- --force');
      process.exit(1);
    }

    await sequelize.sync({ force: true });
    console.log('✓ Tables recreated');

    // Admin user (credentials from env; random password if not provided)
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    let adminPassword = process.env.ADMIN_PASSWORD;
    let generated = false;
    if (!adminPassword) {
      adminPassword = crypto.randomBytes(9).toString('base64url');
      generated = true;
    }
    const hash = bcrypt.hashSync(adminPassword, 10);
    await User.create({ username: adminUsername, email: adminEmail, password: hash });
    console.log(`✓ Admin user created (username: ${adminUsername})`);
    if (generated) {
      console.log(`  Generated password (shown ONCE, save it now): ${adminPassword}`);
    }

    // Profile
    await Profile.create({
      full_name: 'Alvi',
      tagline: 'Full Stack Developer & Creative Problem Solver',
      bio: 'Passionate developer with experience in building modern web applications. I love turning ideas into elegant, functional software solutions. With expertise spanning frontend and backend technologies, I create seamless digital experiences that make an impact.',
      email: 'alvi@example.com',
      location: 'Indonesia',
      github_url: 'https://github.com',
      linkedin_url: 'https://linkedin.com'
    });
    console.log('✓ Profile created');

    // Skills
    const skills = [
      { name: 'JavaScript', category: 'Frontend', proficiency: 90, icon: '⚡', sort_order: 1 },
      { name: 'HTML/CSS', category: 'Frontend', proficiency: 95, icon: '🎨', sort_order: 2 },
      { name: 'React', category: 'Frontend', proficiency: 80, icon: '⚛️', sort_order: 3 },
      { name: 'Vue.js', category: 'Frontend', proficiency: 75, icon: '💚', sort_order: 4 },
      { name: 'Node.js', category: 'Backend', proficiency: 85, icon: '🟢', sort_order: 1 },
      { name: 'Express.js', category: 'Backend', proficiency: 85, icon: '🚀', sort_order: 2 },
      { name: 'Python', category: 'Backend', proficiency: 80, icon: '🐍', sort_order: 3 },
      { name: 'PHP', category: 'Backend', proficiency: 70, icon: '🐘', sort_order: 4 },
      { name: 'MySQL', category: 'Database', proficiency: 85, icon: '🗄️', sort_order: 1 },
      { name: 'MongoDB', category: 'Database', proficiency: 75, icon: '🍃', sort_order: 2 },
      { name: 'Git', category: 'Tools', proficiency: 90, icon: '📦', sort_order: 1 },
      { name: 'Docker', category: 'Tools', proficiency: 65, icon: '🐳', sort_order: 2 },
      { name: 'Linux', category: 'Tools', proficiency: 75, icon: '🐧', sort_order: 3 },
    ];
    await Skill.bulkCreate(skills);
    console.log('✓ Skills created');

    // Demo Projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        slug: 'e-commerce-platform',
        description: 'A full-featured e-commerce platform built with Node.js and React. Features include product management, shopping cart, payment integration, and order tracking.',
        technologies: (['Node.js', 'React', 'MySQL', 'Stripe']),
        project_url: 'https://example.com',
        github_url: 'https://github.com',
        is_featured: true,
        sort_order: 1
      },
      {
        title: 'Task Management App',
        slug: 'task-management-app',
        description: 'A collaborative task management application with real-time updates, team workspaces, and Kanban board views.',
        technologies: (['Vue.js', 'Express', 'MongoDB', 'Socket.io']),
        project_url: 'https://example.com',
        github_url: 'https://github.com',
        is_featured: true,
        sort_order: 2
      },
      {
        title: 'Weather Dashboard',
        slug: 'weather-dashboard',
        description: 'A beautiful weather dashboard that displays real-time weather data with interactive charts and 7-day forecasts.',
        technologies: (['JavaScript', 'Chart.js', 'OpenWeather API']),
        project_url: 'https://example.com',
        github_url: 'https://github.com',
        is_featured: true,
        sort_order: 3
      },
      {
        title: 'Chat Application',
        slug: 'chat-application',
        description: 'Real-time messaging application with private and group chat support, file sharing, and message encryption.',
        technologies: (['Node.js', 'Socket.io', 'React', 'PostgreSQL']),
        project_url: '',
        github_url: 'https://github.com',
        is_featured: false,
        sort_order: 4
      }
    ];
    await Project.bulkCreate(projects);
    console.log('✓ Demo projects created');

    console.log('\n🎉 Database seeded successfully!');
    console.log(`   Admin login: ${adminUsername}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
