const Sequelize = require('sequelize')
const {config} = require('../config')

const db = new Sequelize(config.database_name, config.database_password, {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: './mydb.sqlite'
});

exports.db = db