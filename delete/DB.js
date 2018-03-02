/**
 * config options: http://docs.sequelizejs.com/manual/installation/usage.html
 * config = {
 *      modelspath: './',
 *      database: '',
 *      username: '',
 *      password: '',
 *      host: 'localhost',
 *      dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
 *
 *      pool: {
 *          max: 5,
 *          min: 0,
 *          acquire: 30000,
 *          idle: 10000
 *      },
 *
 *      // SQLite only
 *      storage: 'path/to/database.sqlite',
 *
 *      // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
 *      operatorsAliases: false
 * }
 */

class DB {
    constructor(config){
        this._config = config;
    }

    __init__(next){
        const fs        = require('fs');
        const path      = require('path');
        const Sequelize = require('sequelize');

        let config = this._config;
        let modelspath= (config.modelspath + '/').replace('//', '/');
        let sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, config.database);

        fs.readdirSync(modelspath)
          .filter(file => {
                return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
          })
          .forEach(file => {
                var model = sequelize.import(path.join(modelspath, file));
                DB[model.name] = model;
          });
        
        Object.keys(DB).forEach(modelName => {
            if (DB[modelName].associate) {
                DB[modelName].associate(DB);
            }
        });
        
        sequelize.sync().done(() => {
            // checa se as tabelas físicas estão iguais aos models
            // Object.keys(db).forEach(modelName => {
            //     var table ,sql;
    
            //     if (modelName!='sequelize'){
            //         table = db[modelName].getTableName();
            //         sql = 'select * from ' + table;
            //         console.log(sql);
            //     }
    
            // });
            next();
        });
    
        DB.sequelize = sequelize;
        DB.DataTypes = Sequelize;
    }
}

module.exports = DB;
