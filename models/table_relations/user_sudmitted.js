const Sequelize = require('sequelize');
const db = require('../../database/db');

module.exports = db.sequelize.define(
  'user_sudmitted',
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    submission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
  },
  {
    timestamps: false
  }
);