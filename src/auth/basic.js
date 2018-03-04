/** 
 * @description implements basic authentication
 * use 'my.url.com?logout' for logout
*/

const BaseAuth = require('./base');

class BasicAuth extends BaseAuth {
    request(req, res, next){
        let authorization, credentials;

        if (req.query.logout!==undefined){
            next(new Error('Logout'));
        }
        
        authorization = req.headers['authorization'];  
        
        if (authorization){
            credentials = this.getCredentials(req);

            return this.credentials(credentials.username, credentials.password, (error)=>{
                if (error){
                    this._doAuthenticate(res);
                } else {
                    next(null);
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

module.exports = BasicAuth;
