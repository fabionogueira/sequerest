class ModelViewSet {
    constructor(DB, Sequelize){
        // this._fields = this.fields(Sequelize);
        // this._alias = `model_${(modelIndex++)}`;
        // this._model = DB.define(this._alias, this._fields);
    }

    static __init__(req){
        let n;
        let keys = this._primaryKeys;

        this._model = this.getModel();

        if (!this._model){
            return;
        }

        this._filters = undefined;
        this._fields = this._model.attributes;
        this._keyFilters = undefined;
        this._data = req.body;
        
        for (n in req.query) {
            if (this._fields[n]) {
                this._filters = this._filters || {
                    where: {}
                };
                this._filters.where[n] = req.query[n];
            }
        }

        for (n in req.params) {
            if (keys[n]) {
                this._keyFilters = this._keyFilters || {
                    where: {}
                };
                this._keyFilters.where[n] = req.params[n];
            }
        }

        return this;
    }

    static getData(){
        return this._data;
    }

    static getDataWithoutKey() {
        let n;
        let keys = this._primaryKeys;
        let data = Object.assign({}, this._data);

        for (n in keys) {
            delete(data[n]);
        }

        return data;
    }

    static getFilters(){
        return this._filters;
    }

    static getKeyFilters(){
        return this._keyFilters;
    }

    static setModel(model){
        let att;

        this._primaryKeys = {};
        this._model = model;

        if (model){
            for (att in model.attributes){
                if (model.attributes[att].primaryKey){
                    this._primaryKeys[att] = true;
                }
            }
        }
    }

    static getModel(){
        return this._model;
    }

    static create(res) {
        if (!this._model){
            return res.status(200).json({create:'model not defined'});
        }

        this._model.create(this.getData())
            .then(record => {
                res.status(200).json(record);
            })
            .catch(error => {
                res.status(500).json({
                    error: error.original.code
                });
            });
    }

    static read(res) {
        if (!this._model){
            return res.status(200).json({read:'model not defined'});
        }

        this._model.findAll(this.getKeyFilters())
            .then(list => {
                res.status(200).json(list);
            })
            .catch(error => {
                res.status(500).json({
                    error: error.original.code
                });
            });
    }

    static update(res) {
        let data;

        if (!this._model){
            return res.status(200).json({update:'model not defined'});
        }

        data = this.getDataWithoutKey();

        this._model.update(data, this.getKeyFilters())
            .then(count => {
                if (count > 0) {
                    res.status(200).json(data);
                } else {
                    res.status(404).json(['not found']);
                }
            })
            .catch(error => {
                res.status(500).json({
                    error: error.original.code
                });
            });
    }

    static delete(res) {
        if (!this._model){
            return res.status(200).json({delete:'model not defined'});
        }

        this._model.destroy(this.getKeyFilters())
            .then(count => {
                if (count > 0) {
                    res.status(204).json();
                } else {
                    res.status(404).json(['not found']);
                }
            })
            .catch(error => {
                res.status(500).json({
                    error: error.original.code
                });
            });
    }
}

module.exports = ModelViewSet;
