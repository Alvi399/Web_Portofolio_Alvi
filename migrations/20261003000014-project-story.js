'use strict';
const { addColumnIfMissing, removeColumnIfExists } = require('../helpers/migrationUtils');

// T-14: project storytelling fields + publish status.
// status defaults to 'published' so existing projects stay visible.
module.exports = {
  async up(qi, Sequelize) {
    await addColumnIfMissing(qi, 'projects', 'problem', { type: Sequelize.TEXT, allowNull: true });
    await addColumnIfMissing(qi, 'projects', 'role', { type: Sequelize.STRING(120), allowNull: true });
    await addColumnIfMissing(qi, 'projects', 'impact', { type: Sequelize.TEXT, allowNull: true });
    await addColumnIfMissing(qi, 'projects', 'demo_url', { type: Sequelize.STRING(255), allowNull: true });
    await addColumnIfMissing(qi, 'projects', 'status', {
      type: Sequelize.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'published'
    });
  },
  async down(qi) {
    for (const c of ['problem', 'role', 'impact', 'demo_url', 'status']) {
      await removeColumnIfExists(qi, 'projects', c);
    }
  }
};
