require('dotenv').config();

// Config for sequelize-cli (npm run migrate). Reads the same env as the app.
const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false
};

module.exports = {
  development: base,
  production: base,
  // Separate database for automated tests (never the production DB)
  test: { ...base, database: process.env.DB_NAME_TEST }
};
