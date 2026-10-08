'use strict';
const { addColumnIfMissing, removeColumnIfExists } = require('../helpers/migrationUtils');

// T-11: hero headline, availability status, work preference
module.exports = {
  async up(qi, Sequelize) {
    await addColumnIfMissing(qi, 'profiles', 'headline', { type: Sequelize.STRING(120), allowNull: true });
    await addColumnIfMissing(qi, 'profiles', 'availability_status', {
      type: Sequelize.ENUM('open_to_work', 'freelance', 'not_available'),
      allowNull: false,
      defaultValue: 'open_to_work'
    });
    await addColumnIfMissing(qi, 'profiles', 'work_preference', { type: Sequelize.STRING(60), allowNull: true });
  },
  async down(qi) {
    await removeColumnIfExists(qi, 'profiles', 'headline');
    await removeColumnIfExists(qi, 'profiles', 'availability_status');
    await removeColumnIfExists(qi, 'profiles', 'work_preference');
  }
};
