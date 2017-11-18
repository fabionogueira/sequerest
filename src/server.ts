
import * as express from "express"
import * as bodyParser from 'body-parser'
import {Auth} from './auth'
import {Validator} from './validator'

const app: any = express();

export class Server {
    private static started = false
    private static database: any
    private static registeredRouters:Array<any> = []
    private static conf:any

    public static config(config:any){
        app.use(express.static(config.public))
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: false }))

        this.conf = config

        return this;
    }

    public static start() {
        let server: any;
        
        if ( !this.registeredRouters.find(item=>{return item.pathname=='/'}) ){
            app.get('/', root);
        }

        if (!this.started) {
            this.started = true;
            server = app.listen(this.conf.port);
            console.log('server running in %s', server.address().port);
        }
    }

    public static getRouters(){
        return this.registeredRouters;
    }

    public static route(pathname:any, method?:any, definition?:any) {
        let path, a;

        if (typeof(pathname)=='string'){
            pathname = normalizePath(pathname);
        }
        
        // ("/api/path/", "get", function(){})
        if ( arguments.length == 3 ) {
            this.registeredRouters.push({pathname: pathname, method: method});
            app[method](pathname, definition);
        }

        // ("/api/path/", {database:null, model:null})
        if ( arguments.length == 2 ) {
            if (definition === undefined) {
                definition = method
            }
        
            definition.id = definition.id || 'id';

            definition.getData = definition.getData || function (data:any) {
                let fieldName:string, fieldModelDef:any, fieldModelItem:string, validate:Function, newValue:any;
                let errs: Array<string> = [];
                let newData: any = {};

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

            definition.create = definition.create || function (req: any, res: any) {
                let data = definition.getData(req.body);

                if (data.error) {
                    return res.status(400).json(data.errors)
                }

                data = definition.database ? definition.database.create(data) : {}
                res.status(201).json(data)
            };

            definition.read = definition.read || function (req: any, res: any) {
                let data = definition.database ? definition.database.read(req.params.id) : []
                res.status(200).json(data)
            };

            definition.update = definition.update || function (req: any, res: any) {
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

            definition.delete = definition.delete || function (req: any, res: any) {
                let count: number;
                
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
            
            this.registeredRouters.push({pathname: pathname, method:'get'});
            this.registeredRouters.push({pathname: pathname + ':id', method:'get'});
            this.registeredRouters.push({pathname: pathname, method:'post'});
            this.registeredRouters.push({pathname: pathname + ':id', method:'put'});
            this.registeredRouters.push({pathname: pathname + ':id', method:'delete'});

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
                    
                    this.registeredRouters.push({pathname:a[1], method:a[0]});
                    app[a[0]](a[1], definition.routers[path]);
                }
            }
        }

        return this;
    }

}

function normalizePath(pathname:string){
    pathname = pathname.trim();
    pathname = pathname.substring(pathname.length-1) == '/' ? pathname : pathname + '/';

    return pathname
}

function root(req: any, res: any){
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