const Sequelize = require('sequelize')

class DatabaseSequelize{
    
    constructor(config){
        let username = config.username;
        let password = config.password;
        
        /** @type Sequelize */
        this._sequelize = null;
        this._model = null;
        this._conf = Object.assign({}, config);
        
        delete(this._conf.username)
        delete(this._conf.password)
        console.log(this._conf)
        //this._sequelize = new Sequelize(username, password, this._conf)
    }

    /**
     * @returns {Promise}
     * @param {string|number} id 
     */
    create(data){
        return this._model.create(data)
    }

    update(id, data) {
        let row = this._dbdata.find(row=>{
            return row.id == id;
        });

        if (row){
            data.id = id;

            if (this._transaction){
                this._rowsPending.push({$operation:'update', data:data, old:row});
            }else{
                Object.assign(row, data);
                this._write();
            }
        }

        return row;
    }

    delete(id) {
        let index = this._dbdata.findIndex(row=>{
            return row.id == id;
        });

        if (index>=0){
            if (this._transaction){
                this._rowsPending.push({$operation:'delete', id:id});
            }else{
                this._dbdata.splice(index, 1);
                this._write();
            }

            return 1;
        }

        return 0;
    }

    /**
     * @returns {Promise}
     * @param {string|number} id 
     */
    read(id=null){
        return id ? this._model.findById(id) : this._model.findAll();
    }

    begin(){
     
    }
    
    rowback(){
     
    }

    commit(){
        
    }
}
