const Sequelize = require('sequelize');
const db = require('../../database/db');

module.exports = db.sequelize.define(
  'submission_has_subject',
  {
    submission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    subject_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  },
  {
    timestamps: false
  }
);