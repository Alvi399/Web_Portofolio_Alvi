'use strict';

const { createTableIfMissing } = require('../helpers/migrationUtils');

module.exports = {
  async up(queryInterface, Sequelize) {
    await createTableIfMissing(queryInterface, 'testimonials', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      position: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      company: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      quote: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      photo_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      is_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('testimonials');
  }
};
