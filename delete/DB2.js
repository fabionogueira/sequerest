const DB = require('../src/DB');
const UserModel = require('./UserModel');
const TaskModel = require('./TaskModel');

let DATABASE;

const config = {
    development: {
        modelspath: __dirname,
        dialect: "sqlite",
        storage: __dirname + "/store/db.development.sqlite"
    },
    test: {
        modelspath: __dirname,
        dialect: "sqlite",
        storage: ":memory:"
    },
    production: {
        modelspath: __dirname,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'mysql'
    }
};

const env = process.env.NODE_ENV || 'development';
const config_env = config[env];

if (env == 'development'){
    console.log('database:', config_env.database.storage);
}

DATABASE = new DB(config_env);
DATABASE.setModels([
    UserModel,
    TaskModel
]);

module.exports = DATABASE;
