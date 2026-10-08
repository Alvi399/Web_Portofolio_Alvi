const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Profile = sequelize.define('Profile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
  display_name: { type: DataTypes.STRING(40), allowNull: true, defaultValue: 'Malvix' },
  tagline: { type: DataTypes.STRING, defaultValue: '' },
  bio: { type: DataTypes.TEXT, defaultValue: '' },
  profile_image: { type: DataTypes.STRING, defaultValue: '' },
  email: { type: DataTypes.STRING, defaultValue: '' },
  phone: { type: DataTypes.STRING, defaultValue: '' },
  location: { type: DataTypes.STRING, defaultValue: '' },
  github_url: { type: DataTypes.STRING, defaultValue: '' },
  linkedin_url: { type: DataTypes.STRING, defaultValue: '' },
  resume_url: { type: DataTypes.STRING, defaultValue: '' },
  resume_file: { type: DataTypes.STRING(255), allowNull: true },
  headline: { type: DataTypes.STRING(120), allowNull: true },
  availability_status: {
    type: DataTypes.ENUM('open_to_work', 'freelance', 'not_available'),
    allowNull: false,
    defaultValue: 'open_to_work'
  },
  work_preference: { type: DataTypes.STRING(60), allowNull: true },
  whatsapp: { type: DataTypes.STRING(30), allowNull: true },
  og_image: { type: DataTypes.STRING(255), allowNull: true },
  about_summary: { type: DataTypes.TEXT, allowNull: true },
  looking_for: { type: DataTypes.TEXT, allowNull: true },
  bio_en: { type: DataTypes.TEXT, allowNull: true },
  about_summary_en: { type: DataTypes.TEXT, allowNull: true },
  headline_en: { type: DataTypes.STRING(120), allowNull: true },
  work_preference_en: { type: DataTypes.STRING(60), allowNull: true },
  looking_for_en: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'profiles', timestamps: true });

module.exports = Profile;
