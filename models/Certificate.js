const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Certificate = sequelize.define('Certificate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  issuer: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  credential_url: { type: DataTypes.STRING, defaultValue: '' },
  image_url: { type: DataTypes.STRING, defaultValue: '' },
  category: { 
    type: DataTypes.ENUM('Backend', 'Frontend', 'AI', 'Other'),
    defaultValue: 'Other'
  }
}, { tableName: 'certificates', timestamps: true });

module.exports = Certificate;
