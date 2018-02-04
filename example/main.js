const node_rest = require('../src/server/index');
const config = require('./config/local_vars');

const {UserViewSet, CustomViewSet} = require('./views');

node_rest.server
    .config(config)

    .route('/api/user/', UserViewSet)

//    .route(auth)
    .route('/path/to/api', CustomViewSet)

    .start();
