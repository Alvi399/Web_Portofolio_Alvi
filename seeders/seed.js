const bcrypt = require('bcryptjs');
const { sequelize, Profile, Project, Skill, User } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('✓ Tables recreated');

    // Admin user
    const hash = bcrypt.hashSync('admin123', 10);
    await User.create({ username: 'admin', email: 'admin@portfolio.com', password: hash });
    console.log('✓ Admin user created (username: admin, password: admin123)');

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
        technologies: JSON.stringify(['Node.js', 'React', 'MySQL', 'Stripe']),
        project_url: 'https://example.com',
        github_url: 'https://github.com',
        is_featured: true,
        sort_order: 1
      },
      {
        title: 'Task Management App',
        slug: 'task-management-app',
        description: 'A collaborative task management application with real-time updates, team workspaces, and Kanban board views.',
        technologies: JSON.stringify(['Vue.js', 'Express', 'MongoDB', 'Socket.io']),
        project_url: 'https://example.com',
        github_url: 'https://github.com',
        is_featured: true,
        sort_order: 2
      },
      {
        title: 'Weather Dashboard',
        slug: 'weather-dashboard',
        description: 'A beautiful weather dashboard that displays real-time weather data with interactive charts and 7-day forecasts.',
        technologies: JSON.stringify(['JavaScript', 'Chart.js', 'OpenWeather API']),
        project_url: 'https://example.com',
        github_url: 'https://github.com',
        is_featured: true,
        sort_order: 3
      },
      {
        title: 'Chat Application',
        slug: 'chat-application',
        description: 'Real-time messaging application with private and group chat support, file sharing, and message encryption.',
        technologies: JSON.stringify(['Node.js', 'Socket.io', 'React', 'PostgreSQL']),
        project_url: '',
        github_url: 'https://github.com',
        is_featured: false,
        sort_order: 4
      }
    ];
    await Project.bulkCreate(projects);
    console.log('✓ Demo projects created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('   Admin login: admin / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
