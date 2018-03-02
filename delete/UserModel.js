const Model = require('../../src/Model');

const UserModel = new Model('User', {
    fields: {
        title: Model.DataTypes.STRING,
        login: Model.DataTypes.STRING
    },
    associate(db){
        db.User.hasMany(db.Task);
    }
});

module.exports = UserModel;
