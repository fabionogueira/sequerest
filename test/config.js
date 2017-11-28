exports.config = {
    "device": false,
    
    "port": "8080",
    "public": "/home/fabio/public",
    
    // Sequelize
    "database": {
        username: 'username',
        password: 'password',
        host: 'localhost',
        dialect: 'sqlite',
        
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        
        // SQLite only
        storage: './mydb.sqlite'
    },
    
    "proxy": {
        "test-proxy": {
            // required
            "url": "https://code.jquery.com/jquery-3.2.1.js",
            "method": "GET",

            // optional
            // "headers":{
            //     "authorization": "Basic xyz"
            // },
            // "request": (data:any) => {
            //     return data
            // },
            // "response": (err:any, response:any, next:Function) {
            //     next (response);
            // }
        }
    }
}