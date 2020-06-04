const Sequelize = require('sequelize');
const db = require('../../database/db');

module.exports = db.sequelize.define(
  'user_belongsto_country',
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    country_code: {
        type: Sequelize.STRING,
        allowNull: false,
    }
  },
  {
    timestamps: false
  }
);