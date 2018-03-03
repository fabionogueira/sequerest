const DB = require('../../src/db');
const env = require('./env');

const db = new DB(env.DATABASE_OPTIONS);

// Models/tables
const users = db.addModel('users', require('../models/users.js'));
const comments = db.addModel('comments', require('../models/comments.js'));
const posts = db.addModel('posts', require('../models/posts.js'));

// Relations
const models = db.getModels();
users.hasMany(models.posts);
posts.belongsTo(models.users);
posts.hasMany(models.comments);
comments.belongsTo(models.posts);

module.exports = db;
