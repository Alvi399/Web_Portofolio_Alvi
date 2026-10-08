const fs = require('fs');
const path = require('path');
const { sequelize } = require('./models');

async function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await processDir(fullPath);
    } else if (fullPath.endsWith('.ejs') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      // Do word-boundary replacements
      if (content.includes('image_url')) {
        content = content.replace(/\bimage_url\b/g, 'image');
        changed = true;
      }
      if (content.includes('photo_url')) {
        content = content.replace(/\bphoto_url\b/g, 'photo');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

async function run() {
  try {
    console.log("Refactoring views and controllers...");
    await processDir(path.join(__dirname, 'views'));
    await processDir(path.join(__dirname, 'controllers'));
    await processDir(path.join(__dirname, 'routes'));
    await processDir(path.join(__dirname, 'helpers')); // specifically if any still refer to it
    
    console.log("Syncing database with alter: true...");
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database overhauled successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
