'use strict';
const { addColumnIfMissing, removeColumnIfExists } = require('../helpers/migrationUtils');

// T-10: uploaded CV file (relative path under public/uploads/resume/)
module.exports = {
  async up(qi, Sequelize) {
    await addColumnIfMissing(qi, 'profiles', 'resume_file', { type: Sequelize.STRING(255), allowNull: true });
  },
  async down(qi) {
    await removeColumnIfExists(qi, 'profiles', 'resume_file');
  }
};
