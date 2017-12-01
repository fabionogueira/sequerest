const Sequelize = require('sequelize')
const config = require('./local_vars')

const DB = new Sequelize(
    config.database.name,
    config.database.username,
    config.database.password,
    config.database
);

exports.DB = DB;
exports.Sequelize = Sequelize;
