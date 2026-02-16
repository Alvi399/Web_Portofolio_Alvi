const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  image: { type: DataTypes.STRING, defaultValue: '' },
  image_url: { type: DataTypes.STRING, defaultValue: '' },
  technologies: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('technologies');
      try { return JSON.parse(val); } catch { return []; }
    },
    set(val) {
      this.setDataValue('technologies', JSON.stringify(val));
    }
  },
  project_url: { type: DataTypes.STRING, defaultValue: '' },
  github_url: { type: DataTypes.STRING, defaultValue: '' },
  github_repo_name: { type: DataTypes.STRING, defaultValue: '' },
  stars: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'projects', timestamps: true });

module.exports = Project;
