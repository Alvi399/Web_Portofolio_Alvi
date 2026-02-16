const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Profile = sequelize.define('Profile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
  tagline: { type: DataTypes.STRING, defaultValue: '' },
  bio: { type: DataTypes.TEXT, defaultValue: '' },
  profile_image: { type: DataTypes.STRING, defaultValue: '' },
  email: { type: DataTypes.STRING, defaultValue: '' },
  phone: { type: DataTypes.STRING, defaultValue: '' },
  location: { type: DataTypes.STRING, defaultValue: '' },
  github_url: { type: DataTypes.STRING, defaultValue: '' },
  linkedin_url: { type: DataTypes.STRING, defaultValue: '' },
  resume_url: { type: DataTypes.STRING, defaultValue: '' }
}, { tableName: 'profiles', timestamps: true });

module.exports = Profile;
