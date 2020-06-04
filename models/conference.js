const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
  'conference',
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
    description: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    number_of_seats: {
      type: Sequelize.INTEGER,
      allowNull: true,
      isInt: true,
      min: 0
    },
    availbale_seats: {
      type: Sequelize.INTEGER,
      allowNull: true,
      isInt: true,
      min: 0
    },
    venue: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    date:{
        type: Sequelize.DATE,
        isDate: true,
        allowNull: true
    }
  },
  {
    timestamps: false
  }
);