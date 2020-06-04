const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
  'country',
  {
    code: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    flag: {
      type: Sequelize.STRING,
      defaultValue: ''
    }
  },
  {
    timestamps: false
  }
);