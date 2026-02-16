const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Skill = sequelize.define('Skill', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'General' },
  proficiency: { type: DataTypes.INTEGER, defaultValue: 50 },
  icon: { type: DataTypes.STRING, defaultValue: '' },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'skills', timestamps: true });

module.exports = Skill;
