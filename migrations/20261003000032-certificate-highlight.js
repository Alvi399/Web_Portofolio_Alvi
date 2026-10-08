'use strict';

const { addColumnIfMissing } = require('../helpers/migrationUtils');

module.exports = {
  async up(queryInterface, Sequelize) {
    await addColumnIfMissing(queryInterface, 'certificates', 'is_highlight', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('certificates', 'is_highlight');
  }
};
