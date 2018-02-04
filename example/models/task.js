const Types = require('../../src/server/types');
const DB = require('../db');
const User = require('./user');

let Task = DB.define('Task', {
    title: Types.STRING
});
// Task.belongsTo(User, {
//     onDelete: "CASCADE",
//     foreignKey: {
//         allowNull: false
//     }
// });

module.exports = Task;
