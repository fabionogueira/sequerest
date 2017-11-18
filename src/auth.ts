/**
 * @file auth.ts
 * @author Fábio Nogueira <fabio.bacabal@gmail.com>
 * @version 1.0.0
 */

const jwt = require("jsonwebtoken")
const md5 = require("md5")

let publicKey:string; 
let privateKey:string;
let appId:string;
let ldapId:string; 
let tokenTimeout:string;
let LDAP_CONFIG:any;
let tokensPath = './';
let tokenRefreshTM = (new Date()).getTime();
let userDev:any = {
    username:'',
    password:'',
    definition:{}
};

export default class {
    public static config(options:any){
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
    public static tokenCreate(expiresIn:string='1d', payload:any={}):string{
        //cria o token com base na chave privada
        return jwt.sign(payload || {}, privateKey, {
            "algorithm": 'RS256',
            "expiresIn": expiresIn //em segundos: 60*1=1min, 60*60=3600=1h, 3600*24=1d  
        });
    }

    public static tokenValidate(token:string):Promise<any>{

        return new Promise((resolve, reject)=>{

            //valida o token usando a chave pÃºblica
            jwt.verify(token, publicKey, (err:any, data:any)=>{
                //token invÃ¡lido ou expirado!
                if (err) {
                    err.token = token;
                    return reject(err);    
                }

                resolve(data);
            });

        });

    }

    public static tokenResponse(user:any){
        let userDef:any, payload, groups:Array<string>=[], timeout:string=tokenTimeout || '10s';

        user  = user || {};
        userDef = {};

        userDef = {
            "name"    : user.nome,
            "memberOf": user.membrode
        };

        //filtra os grupos do usuÃ¡rio, retornando somente os que comeÃ§am com o nome da aplicaÃ§Ã£o ele
        //removendo os grupos de negaÃ§Ã£o ex: APPNAME!GRUPONEGADO
        (userDef.memberOf || []).forEach((b:string)=>{
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

    public static isAuthenticated(req:any, res:any, server:any, next:Function){
        let i, xx, device, options:any, token:string, parts:[string], requestRoute:string[], publicRoute:string[], publicMethod:string, requestMethod:string;
    
        requestRoute  = req.originalUrl.split('/');
        requestMethod = req.method;
        token         = (<any>req.headers).authorization || req.body.Authorization;
        device        = req.query.Device || (<any>req.headers).device;

        res.send(401, 'invalid token');

        // (<any>req).memberOf = {};

        // this.tokenValidate(token).then((data:any)=>{
        //     //converte memberOf de array para objeto.
        //     data.memberOf.forEach((item:any)=>{
        //         (<any>req).memberOf[item] = true;
        //     });
            
        //     next();
    
        // }).catch((err:any)=>{
        //     //err.token contém o token analisado
        //     //se o token expirou...
        //     return res.error(err);
        // })
    
        // if (config.device && !device){
        //     return res.error(new Error('Undefined DEVICE'));
        // }
    
        
    }

}
