const sequelize = require('../config/db');
const Profile = require('./Profile');
const Project = require('./Project');
const Skill = require('./Skill');
const Contact = require('./Contact');
const User = require('./User');

module.exports = { sequelize, Profile, Project, Skill, Contact, User };
