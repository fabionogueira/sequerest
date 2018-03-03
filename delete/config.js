const base = {
    root: '/api',
    port: 8080,
    public: "/home/fabio/public",
    modelspath: __dirname + '/models'
};

const config = {
    development: {
        database: {
            dialect: "sqlite",
            storage: __dirname + "/store/db.development.sqlite"
        }
    },
    test: {
        database: {
            dialect: "sqlite",
            storage: ":memory:"
        }
    },
    production: {
        database: {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOSTNAME,
            dialect: 'mysql'
        }
    }
};

const config_env = Object.assign({}, base, config[process.env.NODE_ENV || 'development']);
console.log(config_env.database.storage);
module.exports = config_env;

// module.exports = {
//     database: {
//         "name": "mydb",
//         "host": "localhost",
//         "dialect": "sqlite",
//         "username": "root",
//         "password": null,

//         "define": {
//             "timestamps": false
//         },

//         "pool": {
//             "max": 5,
//             "min": 0,
//             "acquire": 30000,
//             "idle": 10000
//         },

//         // SQLite only
//         "storage": __dirname + "/../mydb.sqlite"
//     },

//     device: false,

//     root: '/api',
//     port: 8080,
//     public: "/home/fabio/public",

//     proxy: {
//         "test-proxy": {
//             // required
//             "url": "https://code.jquery.com/jquery-3.2.1.js",
//             "method": "GET",

//             // optional
//             // "headers":{
//             //     "authorization": "Basic xyz"
//             // },
//             // "request": (data:any) => {
//             //     return data
//             // },
//             // "response": (err:any, response:any, next:Function) {
//             //     next (response);
//             // }
//         }
//     }
// };
