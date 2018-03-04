const BasicAuthenticate = require('../../src/authenticate/basic');

let SESSION = {};

class Authentication extends BasicAuthenticate{
    credentials(username, password, next){
        let error;

        if (SESSION[username+password]){
            return next();
        }

        error = !(username == 'fabio' && password == 'nogueira');

        if (!error){
            SESSION[username+password] = true;
        }

        next(error);
    }
}

module.exports = Authentication;
