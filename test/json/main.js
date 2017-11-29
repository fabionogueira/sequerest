const {Server} = require('../../src/server')
const config = require('./config')
const pessoa = require('./api/pessoa.js')

Server.config(config)

Server.route('/api/pessoa', pessoa)

Server.route('/path/to/api', 'get', (req, res)=>{
    res.send('ok');
})

Server.start();
