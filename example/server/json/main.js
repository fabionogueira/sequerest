const server = require('../../../src/server/server');
const config = require('./config');
const pessoa = require('./api/pessoa.js');

server.config(config);

server.route('/api/pessoa', pessoa);

server.route('/path/to/api', 'get', (req, res)=>{
    res.send('ok');
});

server.start();
