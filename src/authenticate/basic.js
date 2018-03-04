/** 
 * @description implements basic authentication
 * use 'my.url.com?logout' for logout
*/

const BaseAuthentication = require('../lib/base-authentication');

class BasicAuthentication extends BaseAuthentication {
    request(req, res, next){
        let authorization, tmp, buf, plain_auth, creds, username, password;

        if (req.query.logout!==undefined){
            next(true);
        }
        
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

            return this.credentials(username, password, (error)=>{
                if (error){
                    this._doAuthenticate(res);
                } else {
                    next();
                }
            });
        }

        this._doAuthenticate(res);
    }
    
    header(request){
        return `Basic realm="${this.www_authenticate_realm || 'api'}"`;
    }

    _doAuthenticate(res){
        res.status(401);
        res.setHeader('WWW-Authenticate', this.header());
        res.end('Access denied');
    }
}

module.exports = BasicAuthentication;
