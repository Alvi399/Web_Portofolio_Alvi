'use strict';

/**
 * Helpers that make migrations idempotent: safe to run on a database whose
 * tables/columns already exist (e.g. created earlier by sequelize.sync()).
 */
async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  return tables
    .map(t => (typeof t === 'string' ? t : t.tableName || t.TABLE_NAME))
    .map(t => String(t).toLowerCase())
    .includes(tableName.toLowerCase());
}

async function createTableIfMissing(queryInterface, tableName, attributes) {
  if (await tableExists(queryInterface, tableName)) return false;
  await queryInterface.createTable(tableName, attributes);
  return true;
}

async function addColumnIfMissing(queryInterface, tableName, columnName, definition) {
  const desc = await queryInterface.describeTable(tableName);
  if (desc[columnName]) return false;
  await queryInterface.addColumn(tableName, columnName, definition);
  return true;
}

async function removeColumnIfExists(queryInterface, tableName, columnName) {
  const desc = await queryInterface.describeTable(tableName);
  if (!desc[columnName]) return false;
  await queryInterface.removeColumn(tableName, columnName);
  return true;
}

module.exports = { tableExists, createTableIfMissing, addColumnIfMissing, removeColumnIfExists };
