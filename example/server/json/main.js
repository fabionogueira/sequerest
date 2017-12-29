const api = require('../../../src/server/index');
const config = require('./config');
const person = require('./api/person');

api.server
    .config(config)
    .route('/api/person', person)
    .start();
