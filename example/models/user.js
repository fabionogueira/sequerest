const Types = require('../../src/server/types');
const DB = require('../db');
const Task = require('./task');

let User = DB.define('user', 
    {
        username: Types.STRING
    },
    {
        freezeTableName: true
    });

User.hasMany(Task);

module.exports = User;
