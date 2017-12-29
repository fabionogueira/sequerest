const node_rest = require('../../../src/server/index');
const config = require('./config/local_vars');
const person = require('./api/person');

node_rest.server
    .config(config)

    .route('/api/person/', person)
//    .route(auth)
    .route('/path/to/api', 'get', (req, res)=>{
        res.send('ok');
    })

    .start();
