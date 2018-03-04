const {TokenAuth} = require('../../src/auth');

let SESSION = {};

class Auth extends TokenAuth{
    credentials(username, password, next){
        let error;

        if (SESSION[username+password]){
            return next(null);
        }

        error = !(username == 'fabio' && password == 'nogueira');

        if (!error){
            SESSION[username+password] = true;
        }

        next(error ? new Error('Invalidate credentials') : null);
    }
}

module.exports = Auth;
