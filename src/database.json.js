const fs = require('fs')
const path = require('path')

// let FILE:string = `${path.dirname(process.argv[1])}/db.json`;

let instance = {};

class DatabaseJSON{
    
    constructor(filename){
        this._transaction = false;
        this._rowsPending = [];
        this._dbdata = [];
        this._dbid;
        this._filename;

        // Arquivo local JSON
        if (instance[filename]){
            return instance[filename];
        }

        if (!fs.existsSync(filename)){
            fs.closeSync( fs.openSync(filename, "wx") );
        }else{
            try {
                json = JSON.parse(String(fs.readFileSync(filename, "utf8")));
                this._dbdata = json.rows || [];                
            } catch (error) {
                json = {};
            }

            this._dbid = Number(json.id || 1);
        }

        this._filename = filename;
        this._dbdata = this._dbdata || [];
        instance[filename] = this;
    }

    create(data){
        data.id = this._dbid++;

        if (this._transaction){
            this._rowsPending.push({$operation:'insert', data:data});
        }else{
            this._dbdata.push(data);
            this._write();
        }

        return data;
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

    read(id=null){
        let row;
        let list = [];

        if (id){
            row = this._dbdata.find(row=>{
                return row.id == id;
            });
            if (row){
                list.push(row);
            }
        }else{
            list = this._dbdata;
        }

        return list;
    }

    begin(){
        this._transaction = true;
    }
    
    rowback(){
        this._transaction = false;
        this._rowsPending = [];
    }

    commit(){
        let index;

        this._transaction = false;

        this._rowsPending.forEach(row => {
            switch (row.$operation){
                case 'insert':
                    this._dbdata.push(row.data);
                    break;

                case 'update':
                    Object.assign(row.old, row.data);
                    break;

                case 'delete':
                    index = this._dbdata.findIndex(dbrow=>{ return dbrow.id == row.id; });
                    if (index>=0){
                        this._dbdata.splice(index, 1);
                    }
                    break;
            }
        });

        this._write();
    }

    _write(){
        let content;
        
        content = `{"id":${this._dbid}, "rows":${JSON.stringify(this._dbdata)}}`;
        fs.writeFileSync(this._filename, content);
    }
}

exports.DatabaseJSON = DatabaseJSON
