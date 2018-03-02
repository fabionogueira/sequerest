// import { method } from '../../../.cache/typescript/2.6/node_modules/@types/bluebird/index';
const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const Model = require('./Model');
const Api = require('./Api');
const cors = require('./cors');
const proxy = require('./proxy');
const app = express();

let _started = false;
let _registeredRouters = [];
let _conf = null;

module.exports = class Server {
    /**
     * @param {*} config = {
     *      cors: true|false, // default=true
     *      public: 'path/to/public/folder',
     * 
     *      // database
     *      database: {
     *          modelspath: './',
     *          database: '',
     *          username: '',
     *          password: '',
     *          // check options: http://docs.sequelizejs.com/manual/installation/usage.html
     *      },
     *      proxy: {
     *          "test-proxy": {
     *              // required
     *              "url": "https://code.jquery.com/jquery-3.2.1.js",
     *              "method": "GET",
     *
     *              // optional
     *              "headers":{
     *                  "authorization": "Basic xyz"
     *              },
     *              "request": (data:any) => {
     *                  return data
     *              },
     *              "response": (err:any, response:any, next:Function) {
     *                  next (response);
     *              }
     *          }
     *      }
     *  }
     */
    static config(config) {
        if (config.CORS === true || config.CORS === undefined) {
            app.use(cors);
        }

        if (config.PUBLIC) {
            app.use(express.static(config.PUBLIC));
        }

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));

        if (config.PROXY) {
            proxy.config(config.PROXY, app);
        }

        _conf = config;

        return this;
    }

    static start() {
        let sequelize;
        let server, $this = this;
        let rootRouter = _conf.root || '/';
        let rootUsed = _registeredRouters.find(item => {
            return item.pathname == rootRouter;
        });

        // registra as rotas no express
        _registeredRouters.forEach($this.registerApiRouter);
        
        // se a rota raiz não estiver sendo usada, registra para retornar a lista das rotas
        if ( !rootUsed ) {
            app.get(rootRouter, $this._root);
        }

        // starta o servidor
        if (!_started) {
            _started = true;
            server = app.listen(_conf.PORT);
            console.log('server running in %s', server.address().port);
        } 
    
    }

    static registerApiRouter(item){
        let att;
        let params = '';
        let api = item.apiInstance;

        if (!(api instanceof Api)){
            return;
        }

        for (att in api._primaryKeys){
            params += (`:${att}/`);
        }
        if (params == ''){
            params = ':id/';
        }

        item.method = ['GET', 'POST', 'PUT', 'DELETE'];

        // GET: read all
        app.get(item.pathname, (req, res) => {
            api.__request__(req).read(res);
        });
        
        // GET: read filtered
        app.get(item.pathname + params, (req, res) => {
            api.__request__(req).read(res);
        });

        // POST: create
        app.post(item.pathname, (req, res) => {
            api.__request__(req).create(res);
        });

        // PUT: update
        app.put(item.pathname + params, (req, res) => {
            api.__request__(req).updated(res);
        });
        
        // DELETE: delete
        app.delete(item.pathname + params, (req, res) => {
            api.__request__(req).delete(res);
        });
    }

    static getRouters() {
        return _registeredRouters;
    }

    static route(pathname, apiInstance) {
        _registeredRouters.push({
            pathname: `${pathname}/`.replace('//', '/') ,
            apiInstance: apiInstance
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
