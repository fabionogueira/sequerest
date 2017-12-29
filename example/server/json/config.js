const database = require('../../../src/server/database');

module.exports = {
    port : 8080,
    public : `${__dirname}/public`,
    root : '/api',
    database : new database(`${__dirname}/mydb.json`)
};