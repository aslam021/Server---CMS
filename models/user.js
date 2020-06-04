const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
  'users', //users - table name
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      // autoIncrement: true,
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    email: {
      type: Sequelize.STRING,
      isEmail: true,
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      type: Sequelize.STRING(64),
      is: /^[0-9a-f]{64}$/i,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);