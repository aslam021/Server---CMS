const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
  'submission',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    title: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    type: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    file: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    co_authors: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: ''
    }
  },
  {
    timestamps: false
  }
);