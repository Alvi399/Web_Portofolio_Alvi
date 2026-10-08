'use strict';

const { addColumnIfMissing } = require('../helpers/migrationUtils');

module.exports = {
  async up(queryInterface, Sequelize) {
    await addColumnIfMissing(queryInterface, 'profiles', 'about_summary', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await addColumnIfMissing(queryInterface, 'profiles', 'looking_for', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('profiles', 'about_summary');
    await queryInterface.removeColumn('profiles', 'looking_for');
  }
};
