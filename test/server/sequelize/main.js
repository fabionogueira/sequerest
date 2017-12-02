const config = require('./config/local_vars');
const server = require('../../src/server');
const pessoa = require('./api/pessoa');

server
    .config(config)
    
    .route('/api/pessoa/', pessoa)
//    .route(auth)
    .route('/path/to/api', 'get', (req, res)=>{
        res.send('ok');
    })

    .start();
