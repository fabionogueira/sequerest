# under construction

# create folder api
```bash
mkdir myapi
cd myapi
npm install sequerest
```

# create model
```javascript
// ./users-model.js
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            required: true
        }
    });

    return Users;
};
```
# create db
```javascript
// ./db.js
const DB = require('sequerest/db');

const db = new DB({
    dialect: "sqlite",
    storage: "path/to/database.sqlite",
    define: {
        underscored: true
    }
});

// models/tables
const users = db.addModel('users', require('./users-model.js'));

// relations
// const models = db.getModels();
// users.hasMany(models.posts);

module.exports = db;
```
# create authentication class
```javascript
// ./auth.js
const {BasicAuth} = require('sequerest/auth');

// simulate session
let SESSION = {};

class Auth extends BasicAuth{
    credentials(username, password, next){
        let error;

        if (SESSION[username+password]){
            return next(null);
        }

        error = !(username == 'user' && password == 'psw');

        if (!error){
            SESSION[username+password] = true;
        }

        next(error ? new Error('Invalidate credentials') : null);
    }
}

module.exports = Auth;
```

# create api
```javascript
// ./user-api.js
const Api = require('sequerest/api');
const Auth = require('./auth');
const db = require('./db');

class UserApi extends Api {
    get_test(res){
        res.send('test ok')
    }
}

module.exports = new UserApi({
    model: db.getModel('users'),
    ordering_fields:['id'],
    authentication_classe: Auth
});
```
# create server/routers
```javascript
// ./server.js
const server = require('sequerest/server');
const UserApi = require('./user-api');

server
    // set config
    .config({
        CORS: true,
        PORT: '8080'
    })

    // set routers
    .route('/api/user/', UserApi)

    // start server
    .start();
```

# start server
```bash
node server.js
```

# list of registered api
```bash
http://localhost:8080/
```

# testing
```bash
http://localhost:8080/
GET http://localhost:8080/api/user/ List all
GET http://localhost:8080/api/user/1 List one
POST http://localhost:8080/api/user/ Insert
PUT http://localhost:8080/api/user/1 Update
DELETE http://localhost:8080/api/user/1 Delete
GET http://localhost:8080/api/user/test/
```

```bash
check example in: https://github.com/fabionogueira/sequerest/tree/master/example
```
