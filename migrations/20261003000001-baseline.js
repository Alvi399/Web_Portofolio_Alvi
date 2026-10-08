'use strict';
const { createTableIfMissing } = require('../helpers/migrationUtils');

/**
 * Baseline: reproduces the schema in PRD section 5.1.
 * Idempotent - skips tables that already exist.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, TEXT, BOOLEAN, DATE, DATEONLY, ENUM } = Sequelize;
    const id = { type: INTEGER, primaryKey: true, autoIncrement: true, allowNull: false };
    const ts = {
      createdAt: { type: DATE, allowNull: false },
      updatedAt: { type: DATE, allowNull: false }
    };

    await createTableIfMissing(queryInterface, 'users', {
      id,
      username: { type: STRING, allowNull: false, unique: true },
      email: { type: STRING, allowNull: false, unique: true },
      password: { type: STRING, allowNull: false },
      ...ts
    });

    await createTableIfMissing(queryInterface, 'profiles', {
      id,
      full_name: { type: STRING, allowNull: false },
      tagline: { type: STRING, defaultValue: '' },
      bio: { type: TEXT },
      profile_image: { type: STRING, defaultValue: '' },
      email: { type: STRING, defaultValue: '' },
      phone: { type: STRING, defaultValue: '' },
      location: { type: STRING, defaultValue: '' },
      github_url: { type: STRING, defaultValue: '' },
      linkedin_url: { type: STRING, defaultValue: '' },
      resume_url: { type: STRING, defaultValue: '' },
      ...ts
    });

    await createTableIfMissing(queryInterface, 'projects', {
      id,
      title: { type: STRING, allowNull: false },
      slug: { type: STRING, allowNull: false, unique: true },
      description: { type: TEXT },
      image: { type: STRING, defaultValue: '' },
      image_url: { type: STRING, defaultValue: '' },
      technologies: { type: TEXT },
      project_url: { type: STRING, defaultValue: '' },
      github_url: { type: STRING, defaultValue: '' },
      github_repo_name: { type: STRING, defaultValue: '' },
      stars: { type: INTEGER, defaultValue: 0 },
      is_featured: { type: BOOLEAN, defaultValue: false },
      sort_order: { type: INTEGER, defaultValue: 0 },
      ...ts
    });

    await createTableIfMissing(queryInterface, 'skills', {
      id,
      name: { type: STRING, allowNull: false },
      category: { type: STRING, defaultValue: 'General' },
      proficiency: { type: INTEGER, defaultValue: 50 },
      icon: { type: STRING, defaultValue: '' },
      image_url: { type: STRING, defaultValue: '' },
      sort_order: { type: INTEGER, defaultValue: 0 },
      ...ts
    });

    await createTableIfMissing(queryInterface, 'certificates', {
      id,
      title: { type: STRING, allowNull: false },
      issuer: { type: STRING, allowNull: false },
      date: { type: DATEONLY, allowNull: false },
      credential_url: { type: STRING, defaultValue: '' },
      image_url: { type: STRING, defaultValue: '' },
      category: { type: ENUM('Backend', 'Frontend', 'AI', 'Other'), defaultValue: 'Other' },
      ...ts
    });

    await createTableIfMissing(queryInterface, 'journey', {
      id,
      title: { type: STRING, allowNull: false },
      description: { type: TEXT },
      date: { type: DATEONLY, allowNull: false },
      image_url: { type: STRING, defaultValue: '' },
      ...ts
    });

    await createTableIfMissing(queryInterface, 'contacts', {
      id,
      name: { type: STRING, allowNull: false },
      email: { type: STRING, allowNull: false },
      subject: { type: STRING, defaultValue: '' },
      message: { type: TEXT, allowNull: false },
      is_read: { type: BOOLEAN, defaultValue: false },
      ...ts
    });
  },

  // Intentionally non-destructive: the baseline never drops user data.
  async down() {}
};
