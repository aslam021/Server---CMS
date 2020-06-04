const Sequelize = require('sequelize');
const db = require('../../database/db');

module.exports = db.sequelize.define(
  'conference_has_tickets',
  {
    conference_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    tickets_type: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  },
  {
    timestamps: false
  }
);