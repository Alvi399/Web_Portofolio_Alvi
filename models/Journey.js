const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Journey = sequelize.define('Journey', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: true },
  is_current: { type: DataTypes.BOOLEAN, defaultValue: false },
  image: { type: DataTypes.STRING, defaultValue: '' },
  category: { type: DataTypes.STRING, defaultValue: 'experience' }, // 'experience' or 'education'
  title_en: { type: DataTypes.STRING, allowNull: true },
  description_en: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'journey', timestamps: true });

module.exports = Journey;
