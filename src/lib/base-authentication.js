class BaseAuthentication {
    request(req, res, next){
        throw (".request() must be overridden.");
    }

    credentials(){
        throw (".credentials() must be overridden."); 
    }

    header(request){
        return 'base authentication';
    }
}

module.exports = BaseAuthentication;
