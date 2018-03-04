/** 
 * @file server.js
 * @author Fabio Nogueira <fabio.bacabal@gmail.com>
*/

const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');

const Model = require('./lib/model');
const cors = require('./lib/cors');
const proxy = require('./lib/proxy');

const Api = require('./api');

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
     *      PROXY: {
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
        let att, method, k;
        let params = '';
        let api = item.apiInstance;

        if (!(api instanceof Api)){
            return;
        }
        
        Object.getOwnPropertyNames(api.__proto__).forEach(k => {
            let a = k.split('_');
            method = a[0];
            if (method && 'get,post,put,delete'.includes(method)){
                createRouter(method, item.pathname + a[1] + '/', k, api, item);
            }
        });

        if (!item.registerCrud){
            return;
        }

        for (att in api._primaryKeys){
            params += (`:${att}/`);
        }
        if (params == ''){
            params = ':id/';
        }

        createRouter('get', item.pathname, 'read', api, item); // GET: read all
        createRouter('get', item.pathname + params, 'read', api, item); // GET: read filtered
        createRouter('post', item.pathname, 'create', api, item); // POST: create
        createRouter('put', item.pathname + params, 'update', api, item); // PUT: update
        createRouter('delete', item.pathname + params, 'delete', api, item); // DELETE: delete
    }

    static getRouters() {
        return _registeredRouters;
    }

    static route(pathname, apiInstance, registerCrud = true) {
        _registeredRouters.push({
            pathname: `${pathname}/`.replace('//', '/') ,
            apiInstance,
            registerCrud
        });

        return this;
    }

    static _root(req, res) {
        let html;
        let list = '';
        let routers = Server.getRouters();
    
        routers.forEach(item => {
            list += (`<p>[${item.method.join(', ')}] ${item.pathname}</p>`);
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

function createRouter(method, pathname, fn_name, api, item){
    item.method = item.method || [];

    // set/update method list
    if (!item.method.includes(method)){
        item.method.push(method);
    }

    // express router register
    app[method](pathname, request);

    // express request call
    function request(req, res){
        api.__request__(req, res, (instance) => {
            instance[fn_name](res, req);
        });
    }
}
