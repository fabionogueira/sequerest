const Api = require('../../src/api');
const db = require('../config/db');

class CommentApi extends Api {
}

module.exports = new CommentApi({
    model: db.getModel('comments')
});