// variáveis de configuração da máquina onde está a aplicação
// não deve ser versionada, adicionar no .gitignore

exports.database = {
    "name": "mydb",
    "host": "localhost",
    "dialect": "sqlite",
    "username": "root",
    "password": null,

    "define": {
        "timestamps": false
    },

    "pool": {
        "max": 5,
        "min": 0,
        "acquire": 30000,
        "idle": 10000
    },

    // SQLite only
    "storage": "./mydb.sqlite"
}

exports.device = false;

exports.root = '/api';
exports.port = 8080;
exports.public = "/home/fabio/public";

exports.proxy = {
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
};
