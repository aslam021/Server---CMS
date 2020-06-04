const Sequelize = require('sequelize');
const db = require('../../database/db');

module.exports = db.sequelize.define(
  'user_buy_ticket',
  {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    ticket_type: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  },
  {
    timestamps: false
  }
);