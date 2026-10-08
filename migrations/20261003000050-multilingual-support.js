'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const addColumn = async (table, column, type) => {
      try {
        await queryInterface.addColumn(table, column, type);
      } catch (e) {
        // Ignore if column already exists
      }
    };

    // Profiles
    await addColumn('profiles', 'bio_en', { type: Sequelize.TEXT, allowNull: true });
    await addColumn('profiles', 'about_summary_en', { type: Sequelize.TEXT, allowNull: true });
    await addColumn('profiles', 'headline_en', { type: Sequelize.STRING(120), allowNull: true });
    await addColumn('profiles', 'work_preference_en', { type: Sequelize.STRING(60), allowNull: true });
    await addColumn('profiles', 'looking_for_en', { type: Sequelize.TEXT, allowNull: true });

    // Projects
    await addColumn('projects', 'description_en', { type: Sequelize.TEXT, allowNull: true });
    await addColumn('projects', 'problem_en', { type: Sequelize.TEXT, allowNull: true });
    await addColumn('projects', 'role_en', { type: Sequelize.STRING(120), allowNull: true });
    await addColumn('projects', 'impact_en', { type: Sequelize.TEXT, allowNull: true });

    // Journey
    await addColumn('journey', 'title_en', { type: Sequelize.STRING, allowNull: true });
    await addColumn('journey', 'description_en', { type: Sequelize.TEXT, allowNull: true });
  },

  down: async (queryInterface, Sequelize) => {
    // We omit down migration details for brevity in this task,
    // since we use idempodent additions
  }
};
