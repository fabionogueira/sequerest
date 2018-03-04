const server = require('../src/server');

const env = require('./config/env');

const AuthApi = require('./apis/AuthApi');
const UserApi = require('./apis/UserApi');
const PostApi = require('./apis/PostApi');
const CommentApi = require('./apis/CommentApi');

server
    // define as configurações de ambiente, conexão com o banco de dados, etc.
    .config(env)

    // define as rotas
    .route('/api/auth/', AuthApi, false)
    .route('/api/user/', UserApi)
    .route('/api/post/', PostApi)
    .route('/api/comment/', CommentApi)

    // start do servidor
    .start();
