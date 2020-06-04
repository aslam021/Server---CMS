const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
  'review_store',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      min: 1
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    comments: {
      type: Sequelize.STRING,
      defaultValue: ''
    }
  },
  {
    timestamps: false
  }
);