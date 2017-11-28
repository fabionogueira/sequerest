const express = require('express')
const bodyParser = require('body-parser')
const {Auth} = require('./auth')
const {Validator} = require('./validator')
const {cors} = require('./cors')
const {Proxy} = require('./proxy')

const app = express();

let _started = false;
let _database = null;
let _registeredRouters = [];
let _conf = null;

class Server {

    static config(config){
        if (config.cors===true || config.cors===undefined){
            app.use(cors)
        }

        app.use(express.static(config.public))
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: false }))

        Proxy.config(config.proxy, app);
        
        _conf = config

        return this;
    }

    static start() {
        let server;
        
        if ( !_registeredRouters.find(item=>{return item.pathname=='/'}) ){
            app.get('/', root);
        }

        if (!_started) {
            _started = true;
            server = app.listen(_conf.port);
            console.log('server running in %s', server.address().port);
        }
    }

    static getRouters(){
        return _registeredRouters;
    }

    static route(pathname, method=null, definition=null) {
        let path, a;

        if (typeof(pathname)=='string'){
            pathname = normalizePath(pathname);
        }
        
        // ("/api/path/", "get", function(){})
        if ( arguments.length == 3 ) {
            _registeredRouters.push({pathname: pathname, method: method});
            app[method](pathname, definition);
        }

        // ("/api/path/", {database:null, model:null})
        if ( arguments.length == 2 ) {
            if (definition === undefined) {
                definition = method
            }
        
            definition.id = definition.id || 'id';

            definition.getData = definition.getData || function (data) {
                let fieldName, fieldModelDef, fieldModelItem, validate, newValue;
                let errs = [];
                let newData = {};

                if (definition.model) {
                    for (fieldName in definition.model) {
                        fieldModelDef = definition.model[fieldName];
                        if (Object.prototype.toString.call(fieldModelDef) == '[object Object]') {
                            for (fieldModelItem in fieldModelDef) {
                                validate = Validator.get(fieldModelItem);
                                if (validate) {
                                    newValue = validate(data[fieldName], errs, fieldModelDef, fieldName);
                                    if (newValue!==undefined){
                                        newData[fieldName] = newValue;
                                    }
                                }
                            }
                        } else {
                            newData[fieldName] = data[fieldName];
                        }
                    }

                    if (errs.length > 0) {
                        return {
                            error: true,
                            errors: errs
                        }
                    }

                    return newData;
                }

                return data;
            };

            definition.create = definition.create || function (req, res) {
                let data = definition.getData(req.body);

                if (data.error) {
                    return res.status(400).json(data.errors)
                }

                data = definition.database ? definition.database.create(data) : {}
                res.status(201).json(data)
            };

            definition.read = definition.read || function (req, res) {
                let data = definition.database ? definition.database.read(req.params.id) : []
                res.status(200).json(data)
            };

            definition.update = definition.update || function (req, res) {
                let data = definition.getData(req.body)

                if (!req.params[definition.id]) {
                    return res.status(400).json([definition.id + ' is required']);
                }

                if (data.error) {
                    return res.status(400).json(data.errors);
                }

                data = definition.database ? definition.database.update(req.params.id, data) : {}
                res.status(200).json(data)
            };

            definition.delete = definition.delete || function (req, res) {
                let count;
                
                if (!req.params[definition.id]) {
                    return res.status(400).json([definition.id + ' is required']);
                }

                count = definition.database ? definition.database.delete(req.params.id) : 0

                if (count > 0){
                    res.status(204).json()
                }else{
                    res.status(404).json(['not found'])
                }
            };
            
            _registeredRouters.push({pathname: pathname, method:'get'});
            _registeredRouters.push({pathname: pathname + ':id', method:'get'});
            _registeredRouters.push({pathname: pathname, method:'post'});
            _registeredRouters.push({pathname: pathname + ':id', method:'put'});
            _registeredRouters.push({pathname: pathname + ':id', method:'delete'});

            app.get(pathname, definition.read);
            app.get(pathname + ':id', definition.read);
            app.post(pathname, definition.create);
            app.put(pathname + ':id', definition.update);
            app.delete(pathname + ':id', definition.delete);

        }

        // ({})
        if ( arguments.length == 1 ) {
            definition = pathname;
            if (definition.routers) {
                for (path in definition.routers) {
                    a = path.split(' ')
                    if (a.length==1) {
                        a[1] = a[0];
                        a[0] = 'get';
                    }

                    a[0] = a[0].toLowerCase()
                    a[1] = normalizePath(a[1])
                    
                    _registeredRouters.push({pathname:a[1], method:a[0]});
                    app[a[0]](a[1], definition.routers[path]);
                }
            }
        }

        return this;
    }

}

function normalizePath(pathname){
    pathname = pathname.trim();
    pathname = pathname.substring(pathname.length-1) == '/' ? pathname : pathname + '/';

    return pathname
}

function root(req, res){
    let html, s;
    let list = '';
    let routers = Server.getRouters();

    routers.forEach(item=>{
        list += (`<p>${item.method.toUpperCase()} ${item.pathname}</p>`)
    })

    html = 
    `<html><head><title>API List</title></head>
     <body>
        <pre>
            <p><b>registered api list</b></p>${list}
        </pre>
     </body>`;

    res.status(200).send(html);
}

exports.Server = Server