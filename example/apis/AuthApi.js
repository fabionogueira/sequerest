const Api = require('../../src/api');
const Authenticate = require('../config/auth');
const db = require('../config/db');

class AuthApi extends Api {
    post_sign(res){

    }
}

module.exports = new AuthApi();
