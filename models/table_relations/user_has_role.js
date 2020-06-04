const Sequelize = require('sequelize');
const db = require('../../database/db');

module.exports = db.sequelize.define(
  'user_has_role',
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
  },
  {
    timestamps: false
  }
);