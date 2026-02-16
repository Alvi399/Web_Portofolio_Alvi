const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Journey = sequelize.define('Journey', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  image_url: { type: DataTypes.STRING, defaultValue: '' }
}, { tableName: 'journey', timestamps: true });

module.exports = Journey;
