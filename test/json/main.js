const {Server} = require('../../src/server')
const config = require('./config')

Server.config(config)

Server.route('/path/to/api', 'get', (req, res)=>{
    res.send('ok');
})

Server.start();
