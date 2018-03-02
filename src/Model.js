var Sequelize = require('sequelize');
var models = {};
var DEFAULT_OPTIONS = {
    freezeTableName: true
};

class Model{
    constructor(name, definition){
        this._name = name;
        this._definition = definition || {};

        models[name] = this;
    }

    __init__(sequelize){
        var options = Object.assign({}, this._definition.options || {}, DEFAULT_OPTIONS);
        
        this._sqModel = sequelize.define(this._name, this._definition.fields, options);
        this._sqModel.associate = this._definition.associate;
        
        return this._sqModel;
    }

    getModel(){
        return this._sqModel;
    }
    
    static getModels(){
        return models;
    }
} 

Model.DataTypes = Sequelize;

module.exports = Model;
