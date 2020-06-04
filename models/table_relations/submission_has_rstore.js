const Sequelize = require('sequelize');
const db = require('../../database/db');

module.exports = db.sequelize.define(
  'submission_has_rstore',
  {
    submission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    rstore_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  },
  {
    timestamps: false
  }
);