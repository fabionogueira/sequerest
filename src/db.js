const fs = require('fs');
const Sequelize = require('sequelize');

class DB{
    constructor(config){
        let a, f;

        this.models = {};

        if (config.storage){
            a = config.storage.split('/');
            f = a.pop();
            config.storage = a.join('/') 
            config.storage = fs.realpathSync(config.storage) + '/' + f;
            console.log('DB', config.storage);
        }

        if (config.operatorsAliases === undefined){
            config.operatorsAliases = false;
        }
        
        this.Sequelize = Sequelize;
        this.sequelize = new Sequelize(
            config.DATABASE_NAME, 
            config.DATABASE_USERNAME, 
            config.DATABASE_PASSWORD, 
            config
        );
    }

    addModel(name, fn){
        let model = fn(this.sequelize, Sequelize);

        this.models[name] = model;

        return model;
    }

    getModel(name){
        return this.models[name];
    }

    getModels(){
        return this.models;
    }

    setData(data){
        this._initialData = data;
        return this;
    }

    sync(force, next){
        let count = 0;

        function complete(){
            if (count==0){
                next();
            }
        }

        if (arguments.length==1){
            next = force;
        }

        this.sequelize.sync({force:force}).done(() => {
            if (force && this._initialData){
                
                Object.keys(this._initialData).forEach(table => {
                    let model = this.getModel(table);
                    let rows = this._initialData[table];
                    
                    if (model){
                        rows.forEach(row => {
                            count++;
                            insert(model, table, row, ()=>{
                                count--;
                                complete();
                            });
                        });
                    }
                });

                if (count==0) complete();
            } else {
                next();
            }

        });
    }
}

function insert (sqModel, table, row, next) {    
    sqModel.create(row)
        .then(record => {
            console.log(table, 'insert row', JSON.stringify(record));
            next();
        })
        .catch(error => {
            throw error;
        });
};

module.exports = DB;

