const Sequelize = require('sequelize');
const db = require('../../database/db');

module.exports = db.sequelize.define(
  'submission_reviewdby',
  {
    submission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    star: {
        type: Sequelize.INTEGER,
        min: 1,
        max: 5,
        isInt: true,
        allowNull: false
    }
  },
  {
    timestamps: false
  }
);