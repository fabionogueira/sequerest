const server = require('../../../src/server/server');
const config = require('./config/local_vars');
const pessoa = require('./api/pessoa');

server
    .config(config)
    
    .route('/api/pessoa/', pessoa)
//    .route(auth)
    .route('/path/to/api', 'get', (req, res)=>{
        res.send('ok');
    })

    .start();
