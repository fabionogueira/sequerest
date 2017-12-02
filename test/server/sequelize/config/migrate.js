const {DB} = require('./database');
const models = require('../models');

DB.sync().done(() => {
    console.log('migration completed.')
});
