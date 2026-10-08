'use strict';
const { addColumnIfMissing, removeColumnIfExists } = require('../helpers/migrationUtils');

// T-11a: display_name for short name ("Malvix")
module.exports = {
  async up(qi, Sequelize) {
    await addColumnIfMissing(qi, 'profiles', 'display_name', {
      type: Sequelize.STRING(40),
      allowNull: true,
      defaultValue: 'Malvix'
    });
  },
  async down(qi) {
    await removeColumnIfExists(qi, 'profiles', 'display_name');
  }
};
