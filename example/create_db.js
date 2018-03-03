const db = require('./config/db');
const data = require('./config/data.json');

// sincroniza o banco de dados
db
    .setData(data)
    .sync(true, ()=>{
            console.log();
            console.log('database installed');
        }
    );
