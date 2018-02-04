const ModelViewSet = require('../src/server/model-view-set');
const User = require('./models/user');

class UserViewSet extends ModelViewSet{
    static getModel(){
        return User;
    }
}

class CustomViewSet extends ModelViewSet{
    static read(res){
        res.status(200).json({custom: 'path/to/api/ ok'});
    }
}

module.exports = {
    UserViewSet,
    CustomViewSet
};
