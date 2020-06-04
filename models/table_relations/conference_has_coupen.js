const Sequelize = require('sequelize');
const db = require('../../database/db');

module.exports = db.sequelize.define(
  'conference_has_coupen',
  {
    conference_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    coupen_vendor: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  },
  {
    timestamps: false
  }
);