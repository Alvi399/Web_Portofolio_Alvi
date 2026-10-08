'use strict';
const { addColumnIfMissing, removeColumnIfExists } = require('../helpers/migrationUtils');

// T-12: WhatsApp number (international format without "+")
module.exports = {
  async up(qi, Sequelize) {
    await addColumnIfMissing(qi, 'profiles', 'whatsapp', { type: Sequelize.STRING(30), allowNull: true });
  },
  async down(qi) {
    await removeColumnIfExists(qi, 'profiles', 'whatsapp');
  }
};
