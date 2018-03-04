class BaseAuthentication {
    options(){
        return {};
    }

    request(req, res, next){
        throw (".request() must be overridden.");
    }

    credentials(){
        throw (".credentials() must be overridden."); 
    }

    header(request){
        return 'base authentication';
    }

    getCredentials(req){
        let authorization, tmp, buf, plain_auth, creds, username, password;

        // auth is in base64(username:password)  so we need to decode the base64
        authorization = req.headers['authorization'];  
        
        if (authorization){
            tmp = authorization.split(' ');  // "Basic Y2hhcmxlczoxMjM0NQ=="
            buf = new Buffer(tmp[1], 'base64');
            plain_auth = buf.toString();

            // At this point plain_auth = "username:password"
            creds = plain_auth.split(':');      // split on a ':'
            username = creds[0];
            password = creds[1];
        } else {
            username = req.body.username;
            password = req.body.password;
        }

        return {
            username,
            password
        };
    }
}

module.exports = BaseAuthentication;
