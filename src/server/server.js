// import { method } from '../../../.cache/typescript/2.6/node_modules/@types/bluebird/index';

const express = require('express');
const bodyParser = require('body-parser');
// const validator = require('./validator');
const cors = require('./cors');
const proxy = require('./proxy');
const app = express();

let _started = false;
let _registeredRouters = [];
let _conf = null;

module.exports = class Server {
    static config(config) {
        if (config.cors === true || config.cors === undefined) {
            app.use(cors);
        }

        if (config.public) {
            app.use(express.static(config.public));
        }

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));

        if (config.proxy) {
            proxy.config(config.proxy, app);
        }

        _conf = config;

        return this;
    }

    static start() {
        let server;
        let rootRouter = _conf.root || '/';
        let rootUsed = _registeredRouters.find(item => {
            return item.pathname == rootRouter;
        });

        _registeredRouters.forEach(this.registerViewSetRouter);

        // se a rota raiz não estiver sendo usada, registra para retornar a lista das rotas
        if ( !rootUsed ) {
            app.get(rootRouter, this._root);
        }

        if (!_started) {
            _started = true;
            server = app.listen(_conf.port);
            console.log('server running in %s', server.address().port);
        }
    }

    static registerViewSetRouter(item){
        let att;
        let params = '';

        if (!item.modelViewSet.__init__){
            return;
        }

        item.modelViewSet.setModel(item.modelViewSet.getModel());

        for (att in item.modelViewSet._primaryKeys){
            params += (`:${att}/`);
        }
        if (params == ''){
            params = ':id/';
        }

        item.method = 'GET POST PUT DELETE';

        // GET: read all
        app.get(item.pathname, (req, res) => {
            item.modelViewSet.__init__(req);
            item.modelViewSet.read(res);
        });
        
        // GET: read filtered
        app.get(item.pathname + params, (req, res) => {
            item.modelViewSet.__init__(req);
            item.modelViewSet.read(res);
        });

        // POST: create
        app.post(item.pathname, (req, res) => {
            item.modelViewSet.__init__(req);
            item.modelViewSet.create(res);
        });

        // PUT: update
        app.put(item.pathname + params, (req, res) => {
            item.modelViewSet.__init__(req);
            item.modelViewSet.updated(res);
        });
        
        // DELETE: delete
        app.delete(item.pathname + params, (req, res) => {
            item.modelViewSet.__init__(req);
            item.modelViewSet.delete(res);
        });
    }

    static getRouters() {
        return _registeredRouters;
    }

    static route(pathname, modelViewSet) {
        _registeredRouters.push({
            pathname: `${pathname}/`.replace('//', '/') ,
            modelViewSet: modelViewSet
        });

        return this;
    }

    static _root(req, res) {
        let html;
        let list = '';
        let routers = Server.getRouters();
    
        routers.forEach(item => {
            list += (`<p>${item.method.toUpperCase()} ${item.pathname}</p>`);
        });
    
        html =
            `<html><head><title>API List</title></head>
         <body>
            <pre>
                <p><b>registered api list</b></p>${list}
            </pre>
         </body>`;
    
        res.status(200).send(html);
    }
};
