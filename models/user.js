const Sequelize = require('sequelize')
const db = require('../database/db.js')

module.exports = db.sequelize.define(
  'user', //user - table name
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },  
    // first_name: {
    //   type: Sequelize.STRING,
    //   defaultValue: ''
    // },
    // last_name: {
    //   type: Sequelize.STRING,
    //   defaultValue: ''
    // },
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    // created: {
    //   type: Sequelize.DATE,
    //   defaultValue: Sequelize.NOW
    // }
  },
  {
    timestamps: false
  }
)