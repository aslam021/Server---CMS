const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
  'tickets',
  {
    type: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    price: {
      type: Sequelize.DECIMAL,
      isDecimal: true,
      defaultValue: 100
    }
  },
  {
    timestamps: false
  }
);