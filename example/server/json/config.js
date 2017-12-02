const database = require('../../../src/server/database');

module.exports = {
    port : 8080,
    public : '/home/fabio/node-rest-server/test/json/public',
    root : '/api',
    database : new database('./mydb.json')
};
