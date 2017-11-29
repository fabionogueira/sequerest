const {Server} = require('../../src/server')

// const {auth} = require('./api/auth')
const {pessoa} = require('./api/pessoa')
const config = require('./config/local_vars')

Server
    .config(config)
    
    .route('/api/pessoa/', pessoa)
//    .route(auth)
    .route('/path/to/api', 'get', (req, res)=>{
        res.send('ok');
    })

    .start();
