const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
  'coupen_codes',
  {
    vendor: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false
    },
    discount: {
      type: Sequelize.DECIMAL,
      isDecimal: true, 
      defaultValue: 5
    }
  },
  {
    timestamps: false
  }
);