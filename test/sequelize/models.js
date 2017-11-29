const Sequelize = require('sequelize')
const config = require('./config/local_vars')

const db = new Sequelize(
    config.database.name,
    config.database.username,
    config.database.password,
    config.database
);

exports.User = db.define('user', {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    }
});
