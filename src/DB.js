const Sequelize = require('sequelize');

class DB{
    constructor(config){
        this.Sequelize = Sequelize;
        this.sequelize = new Sequelize(
            config.DATABASE_NAME, 
            config.DATABASE_USERNAME, 
            config.DATABASE_PASSWORD, 
            config.DATABASE_OPTIONS
        );
    }

    addModel(name, fn){
        this[name] = fn(this.sequelize, Sequelize);
        return this[name];
    }

    getModel(name){
        return this[name];
    }

    sync(next){
        this.sequelize.sync().done(() => {
            next();
        });
    }
}

module.exports = DB;

