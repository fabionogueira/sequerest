const {db} = require('./db')

const User = db.define('user', {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    }
});

exports.User = User