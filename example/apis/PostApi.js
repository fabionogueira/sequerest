const Api = require('../../src/api');
const db = require('../config/db');

class PostApi extends Api {
}

module.exports = new PostApi(db.getModel('posts'));