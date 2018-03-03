const Sequelize = require('sequelize');

const env = require('./env');
const createData = require('./db.data');

const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, env.DATABASE_OPTIONS);

// Connect all the models/tables in the database to a db object, so everything is accessible via one object
let db = {
    Sequelize,
    sequelize,
    createData(){
        createData(db);
    },
    
    // Models/tables
    users: require('../models/users.js')(sequelize, Sequelize),
    comments: require('../models/comments.js')(sequelize, Sequelize),
    posts: require('../models/posts.js')(sequelize, Sequelize)
};

// Relations
db.comments.belongsTo(db.posts);
db.posts.hasMany(db.comments);
db.posts.belongsTo(db.users);
db.users.hasMany(db.posts);

module.exports = db;

