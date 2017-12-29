
module.exports = {
    database: {
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
        "storage": __dirname + "/../mydb.sqlite"
    },

    device: false,

    root: '/api',
    port: 8080,
    public: "/home/fabio/public",

    proxy: {
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
};
