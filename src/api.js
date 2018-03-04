const DEFAULT_OPTIONS = {
    filter_fields: [],
    ordering_fields: [],
    ordering:[], // default ordering
    authentication_classe: null, // SessionAuthentication, BasicAuthentication
    permission_classe: null // IsAuthenticated
};

class Api {

    /**
     * 
     * @param {DEFAULT_OPTIONS} options 
     */
    constructor(options = {}){
        options = (options.sequelize ? {model:options} : options);
        options = Object.assign({}, DEFAULT_OPTIONS, options);
        
        this._options = options;
        
        if (options.authentication_classe){
            options.authentication_classe_instance = new options.authentication_classe();
        }

        if (options.model){
            this._sqModel = options.model;
            this._primaryKeys = {};
    
            Object.keys(options.model.attributes).forEach(field => {
                if (options.model.attributes[field].primaryKey){
                    this._primaryKeys[field] = true;
                }
            });
        }
    }

    __request__(req, res, next){
        let n, v;
        let keys = this._primaryKeys;
        let sqModel = this.getModel();
        let auth = this._options.authentication_classe_instance;

        const after_authentication = (error) => {
            if (!sqModel){
                return resolve(this);
            }

            if (error) {
                res.status(401);
                return res.end(`Access denied. ${error.message}`);
            }

            this._filters = undefined;
            this._keyFilters = undefined;
            this._ordering = [];
            this._fields = sqModel.attributes;
            this._data = req.body;
            
            for (n in req.query) {
                v = req.query[n];

                if (this._fields[n]) {
                    /**
                     * http://example.com/api/products/?category=clothing&max_price=10.00
                     *      select ... where category='clothing' AND max_price=10.00
                     */
                    if (this._options.filter_fields.indexOf(n) >= 0){
                        this._filters = this._filters || {
                            where: {}
                        };
                        this._filters.where[n] = v;
                    }
                }

                if (n=='ordering'){
                    /**
                     * http://example.com/api/users?ordering=username
                     *      select ... order by username
                     * 
                     * http://example.com/api/users?ordering=-username
                     *      select ... order by username DESC
                     * 
                     * http://example.com/api/users?ordering=username,-account
                     *      select ... order by username, account DESC
                     */
                    v.split(',').forEach(f => {
                        let a = f.split('-');
                        let o = a.length > 1 ? 'DESC' : 'ASC';
                        
                        f = (o == 'DESC' ? a[1] : a[0]);

                        this._ordering = this._ordering || [];
                        
                        if (this._options.ordering_fields.indexOf(f) >= 0){
                            this._ordering.push([f, o]);
                        }
                    });
                    
                }
            }

            // set ordering by options.ordering, overriding ?ordering=xxx
            // TODO


            for (n in req.params) {
                if (keys[n]) {
                    this._keyFilters = this._keyFilters || {
                        where: {}
                    };
                    this._keyFilters.where[n] = req.params[n];
                }
            }

            next(this);
        }

        auth ? auth.request(req, res, after_authentication) : next();
    }

    getData(withKeys = true){
        return withKeys ? this._data : this.getDataWithoutKey();
    }

    getOrdering(){
        return this._ordering;
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

    getReadOptions(){
        let options = Object.assign({}, this.getFilters(), this.getKeyFilters());
        
        options.order = this.getOrdering();

        return options;
    }

    getUpdateOptions(){
        return Object.assign({}, this.getKeyFilters());
    }
    
    getDeleteOptions(){
        return Object.assign({}, this.getKeyFilters());
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
                    error: error.message
                });
            });
    }

    read(res) {
        let options = this.getReadOptions();
        let sqModel = this.getModel();

        if (!sqModel){
            return res.status(200).json({read:'model not defined'});
        }
        
        sqModel.findAll(options)
            .then(list => {
                res.status(200).json(list);
            })
            .catch(error => {
                res.status(500).json({
                    error: error.message
                });
            });
    }

    update(res) {
        let options = this.getUpdateOptions();
        let sqModel = this.getModel();
        let data = this.getDataWithoutKey();

        if (!sqModel){
            return res.status(200).json({update:'model not defined'});
        }

        sqModel.update(data, options)
            .then(count => {
                if (count > 0) {
                    res.status(200).json(data);
                } else {
                    res.status(404).json(['not found']);
                }
            })
            .catch(error => {
                res.status(500).json({
                    error: error.message
                });
            });
    }

    delete(res) {
        let options = this.getDeleteOptions(); 
        let sqModel = this.getModel();

        if (!this._sqModel){
            return res.status(200).json({delete:'model not defined'});
        }

        sqModel.destroy(options)
            .then(count => {
                if (count > 0) {
                    res.status(204).json();
                } else {
                    res.status(404).json(['not found']);
                }
            })
            .catch(error => {
                res.status(500).json({
                    error: error.message
                });
            });
    }
}

module.exports = Api;
