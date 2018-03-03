class Api {

    constructor(sqModel){
        this._sqModel = sqModel;
        this._primaryKeys = {};

        Object.keys(sqModel.attributes).forEach(field => {
            if (sqModel.attributes[field].primaryKey){
                this._primaryKeys[field] = true;
            }
        });
    }
    __request__(req){
        let n;
        let keys = this._primaryKeys;
        let sqModel = this.getModel();
        
        if (!sqModel){
            return this;
        }

        this._filters = undefined;
        this._fields = sqModel.attributes;
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

    getData(withKeys = true){
        return withKeys ? this._data : this.getDataWithoutKey();
    }

    getFilters(){
        return this._filters;
    }

    getKeyFilters(){
        return this._keyFilters;
    }

    getDataWithoutKey() {
        let n;
        let keys = this._primaryKeys;
        let data = Object.assign({}, this._data);

        for (n in keys) {
            delete(data[n]);
        }

        return data;
    }

    getModel(){
        return this._sqModel;
    }

    create(res) {
        let sqModel = this.getModel();
        let data = this.getData();

        if (!sqModel){
            return res.status(200).json({create:'model not defined'});
        }

        sqModel.create(data)
            .then(record => {
                res.status(200).json(record);
            })
            .catch(error => {
                res.status(500).json({
                    error: error.original.code
                });
            });
    }

    read(res) {
        let sqModel = this.getModel();

        if (!sqModel){
            return res.status(200).json({read:'model not defined'});
        }
        
        sqModel.findAll(this.getKeyFilters())
            .then(list => {
                res.status(200).json(list);
            })
            .catch(error => {
                res.status(500).json({
                    error: error.original.code
                });
            });
    }

    update(res) {
        let sqModel = this.getModel();
        let data = this.getDataWithoutKey();

        if (!sqModel){
            return res.status(200).json({update:'model not defined'});
        }

        sqModel.update(data, this.getKeyFilters())
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

    delete(res) {
        let sqModel = this.getModel();
        let keyFilters = this.getKeyFilters();

        if (!this._sqModel){
            return res.status(200).json({delete:'model not defined'});
        }

        sqModel.destroy(keyFilters)
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

module.exports = Api;
