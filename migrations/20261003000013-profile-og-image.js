'use strict';
const { addColumnIfMissing, removeColumnIfExists } = require('../helpers/migrationUtils');

// T-13: default Open Graph image
module.exports = {
  async up(qi, Sequelize) {
    await addColumnIfMissing(qi, 'profiles', 'og_image', { type: Sequelize.STRING(255), allowNull: true });
  },
  async down(qi) {
    await removeColumnIfExists(qi, 'profiles', 'og_image');
  }
};
