const jwt = require('jsonwebtoken');
const BaseAuth = require('./base');

class TokenAuth extends BaseAuth {
    options(){
        return {
            publicKey: null,
            privateKey: null
        };
    }

    request(req, res, next){
        let authorization, credentials, token, a;
        
        // Token hkja097y9n0c98un20984un-8upfoijf-08u293n98098nosyfgbf9865iuygas87587vv
        authorization = req.headers['authorization'];  
        if (authorization){
            a = authorization.split(' ');
            token = (a[0] == 'Token' ? a[1] : null);
        }

        if (!token){
            token = req.body.token;
        }

        if (!token){
            credentials = this.getCredentials(req);
            this.credentials(credentials.username, credentials.password, next);
        } else {
            // validar o token
            this.tokenValidate(token, next);
        }
    
    }

    getAuthenticateHeader(request){
        return 'Token';
    }

    tokenCreate(expiresIn='1d', payload={}){
        //cria o token com base na chave privada
        return jwt.sign(payload || {}, this._privateKey, {
            "algorithm": 'RS256',
            "expiresIn": expiresIn //em segundos: 60*1=1min, 60*60=3600=1h, 3600*24=1d  
        });
    }

    tokenValidate(token, next){
        next();
        // //valida o token usando a chave pública
        // jwt.verify(token, this._publicKey, (err, data)=>{
        //     //token inválido ou expirado!
        //     if (err) {
        //         err.token = token;
        //         return reject(err);    
        //     }

        //     resolve(data);
        // });
    }

    tokenValidate(token){

    }
}

module.exports = TokenAuth;
