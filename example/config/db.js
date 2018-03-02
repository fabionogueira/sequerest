const DB = require('../../src/DB');
const env = require('./env');

const db = new DB(env);

// Models/tables
const users = db.addModel('users', require('../models/users.js'));
const comments = db.addModel('comments', require('../models/comments.js'));
const posts = db.addModel('posts', require('../models/posts.js'));

// Relations
comments.belongsTo(db.posts);
posts.hasMany(db.comments);
posts.belongsTo(db.users);
users.hasMany(db.posts);

module.exports = db;
