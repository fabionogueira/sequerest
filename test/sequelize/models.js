const {DB, Sequelize} = require('./config/database')

exports.User = DB.define('user', {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    birthday: {
      type: Sequelize.DATE
    }
});
