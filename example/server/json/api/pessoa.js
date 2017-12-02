const config = require('../config');

module.exports = {
    database: config.database,
    model: {
        id: 0,
        name: {
            max_length: 10,
            null: false,
            verbose_name: 'Name',
            default: undefined,
            type: 'string'
        }
    }
}