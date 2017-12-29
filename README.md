# create folder api
```bash
mkdir myapi
cd myapi
npm install api-rest
```

# main.js
```javascript
const rest = require('api-rest');

// simple database only develop test
const MyDB = new rest.Database("./mydb.json");

const config = {
    "port": "8080",
    "public": "/path/to/public_files"
}

// sample the CRUD api
const person = {
    auth: true,
    database: MyDB,
    model: {
        id: 0,
        name: {
            max_length: 20,
            null: false,
            verbose_name: 'Name',
            default: undefined,
            type: 'string'
        }
    }
}

rest.Server
    // set config
    .config(config)
    
    // register routers
    .route('/api/person/', pessoa)
    .route('/path/to/api', 'get', (req, res)=>{
        res.send('ok');
    })
	
    // start server
    .start();
```

# start api
```bash
node main.js
```

# list of registered api
```bash
http://localhost:8080/
```
