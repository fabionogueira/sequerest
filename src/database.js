const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const DatabaseJSON = require('./database.json')
const DatabaseSequelize = require('./database.sequelize')

let instance = {}

class Database {
    
    constructor(config){
        /** @type DatabaseJSON */
        this._db = null;

        if (config instanceof Sequelize){
            this._db = new DatabaseSequelize(config)
        }else{
            this._db = new DatabaseJSON(config.storage)
        }
    }

    create(data){
        return this._db.create(data);
    }

    update(id, data) {
        return this._db.update(id, data);
    }

    delete(id) {
        return this._db.delete(id);
    }

    read(id=null){
        return this._db.read(id);
    }

    begin(){
        return this._db.begin();
    }
    
    rowback(){
        return this._db.rowback();
    }

    commit(){
        return this._db.commit();
    }
}

exports.Database = Database