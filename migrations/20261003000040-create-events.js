'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.showAllTables();
    if (!tableInfo.includes('events')) {
      await queryInterface.createTable('events', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        event_type: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        target_id: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        ip_hash: {
          type: Sequelize.STRING(64),
          allowNull: true
        },
        user_agent: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.showAllTables();
    if (tableInfo.includes('events')) {
      await queryInterface.dropTable('events');
    }
  }
};
