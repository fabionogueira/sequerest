const db = require('../../src/database');

module.exports = {
    port : 8080,
    public : '/home/fabio/node-rest-server/test/json/public',
    root : '/api',
    database : new db.Database('./mydb.json')
};
