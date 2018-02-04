/**
 * @file auth.ts
 * @author Fábio Nogueira <fabio.bacabal@gmail.com>
 * @version 1.0.0
 */

const jwt = require("jsonwebtoken");

let publicKey; 
let privateKey;
let appId;
let ldapId; 
let tokenTimeout;
let tokensPath = './';

module.exports = class Auth {
    static config(options){
        tokenTimeout = options.tokenTimeout;
        appId        = options.appId;
        publicKey    = options.publicKey;
        privateKey   = options.privateKey;
        tokensPath   = options.tokensPath || './';

        if (tokensPath.substring(tokensPath.length-1)!='/'){
            tokensPath += '/';
        }
    }

    /**
     * @description Cria um token
     */
    static tokenCreate(expiresIn='1d', payload={}){
        //cria o token com base na chave privada
        return jwt.sign(payload || {}, privateKey, {
            "algorithm": 'RS256',
            "expiresIn": expiresIn //em segundos: 60*1=1min, 60*60=3600=1h, 3600*24=1d  
        });
    }

    static tokenValidate(token){

        return new Promise((resolve, reject)=>{

            //valida o token usando a chave pÃºblica
            jwt.verify(token, publicKey, (err, data)=>{
                //token invÃ¡lido ou expirado!
                if (err) {
                    err.token = token;
                    return reject(err);    
                }

                resolve(data);
            });

        });

    }

    static tokenResponse(user){
        let userDef, payload, groups=[], timeout=tokenTimeout || '10s';

        user  = user || {};
        userDef = {};

        userDef = {
            "name"    : user.nome,
            "memberOf": user.membrode
        };

        //filtra os grupos do usuÃ¡rio, retornando somente os que comeÃ§am com o nome da aplicaÃ§Ã£o ele
        //removendo os grupos de negaÃ§Ã£o ex: APPNAME!GRUPONEGADO
        (userDef.memberOf || []).forEach((b)=>{
            let s = b.substring(0, appId.length);
            if (s == appId && b.split('!').length==1){
                groups.push(b);
            }
        });
        userDef.memberOf = groups;
        
        payload = {
            userId  : user[ldapId],
            device  : user.device,
            deviceId: user.deviceId,
            memberOf: groups
        };

        return {
            "user"   : userDef,
            "timeout": timeout,
            "token"  : this.tokenCreate(timeout, payload) //1d=1dia 
        };
    }

    static isAuthenticated(req, res){
        let device, token, requestRoute, requestMethod;
    
        requestRoute  = req.originalUrl.split('/');
        requestMethod = req.method;
        token         = req.headers.authorization || req.body.Authorization;
        device        = req.query.Device || req.headers.device;

        res.send(401, 'invalid token');

        // (<any>req).memberOf = {};

        // this.tokenValidate(token).then((data)=>{
        //     //converte memberOf de array para objeto.
        //     data.memberOf.forEach((item)=>{
        //         (<any>req).memberOf[item] = true;
        //     });
            
        //     next();
    
        // }).catch((err)=>{
        //     //err.token contém o token analisado
        //     //se o token expirou...
        //     return res.error(err);
        // })
    
        // if (config.device && !device){
        //     return res.error(new Error('Undefined DEVICE'));
        // }
    
        
    }

};
