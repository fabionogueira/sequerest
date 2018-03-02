// example by: https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/

const node_rest = require('../src/index');

const env = require('./config/env');
const db = require('./config/db');
const UserApi = require('./apis/UserApi');

node_rest.server.config(env)
    .route('/api/user/', UserApi);

// sincroniza o banco de dados
db.sync(() => {

    // insere os dados iniciais
    if (env.NODE_ENV == 'development') {
        // db.createData();
    }

    // inicializa o servidor
    node_rest.server.start();
});
