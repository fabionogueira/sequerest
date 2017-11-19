import * as fs from 'fs';
import * as path from 'path';

// let FILE:string = `${path.dirname(process.argv[1])}/db.json`;

let instance:any = {};

export class Database{
    private transaction:boolean = false;
    private rowsPending:Array<any> = [];
    private dbdata:Array<any> = [];
    private dbid:number;

    constructor(private filename:string){
        let json;

        if (instance[filename]){
            return instance[filename];
        }

        if (!fs.existsSync(filename)){
            fs.closeSync( fs.openSync(filename, "wx") );
        }else{
            try {
                json = JSON.parse(String(fs.readFileSync(filename, "utf8")));
                this.dbdata = json.rows || [];                
            } catch (error) {
                json = {};
            }

            this.dbid = Number(json.id || 1);
        }

        this.dbdata = this.dbdata || [];
        instance[filename] = this;
    }

    create(data:any) : any{
        data.id = this.dbid++;

        if (this.transaction){
            this.rowsPending.push({$operation:'insert', data:data});
        }else{
            this.dbdata.push(data);
            this.write();
        }

        return data;
    }

    update(id:string, data:any) : any{
        let row = this.dbdata.find(row=>{
            return row.id == id;
        });

        if (row){
            data.id = id;

            if (this.transaction){
                this.rowsPending.push({$operation:'update', data:data, old:row});
            }else{
                Object.assign(row, data);
                this.write();
            }
        }

        return row;
    }

    delete(id:string) : number{
        let index = this.dbdata.findIndex(row=>{
            return row.id == id;
        });

        if (index>=0){
            if (this.transaction){
                this.rowsPending.push({$operation:'delete', id:id});
            }else{
                this.dbdata.splice(index, 1);
                this.write();
            }

            return 1;
        }

        return 0;
    }

    read(id:string=null) : Array<any>{
        let row;
        let list:Array<any> = [];

        if (id){
            row = this.dbdata.find(row=>{
                return row.id == id;
            });
            if (row){
                list.push(row);
            }
        }else{
            list = this.dbdata;
        }

        return list;
    }

    begin(){
        this.transaction = true;
    }
    
    rowback(){
        this.transaction = false;
        this.rowsPending = [];
    }

    commit(){
        let index:number;

        this.transaction = false;

        this.rowsPending.forEach(row => {
            switch (row.$operation){
                case 'insert':
                    this.dbdata.push(row.data);
                    break;

                case 'update':
                    Object.assign(row.old, row.data);
                    break;

                case 'delete':
                    index = this.dbdata.findIndex(dbrow=>{ return dbrow.id == row.id; });
                    if (index>=0){
                        this.dbdata.splice(index, 1);
                    }
                    break;
            }
        });

        this.write();
    }

    private write(){
        let content;
        
        content = `{"id":${this.dbid}, "rows":${JSON.stringify(this.dbdata)}}`;
        fs.writeFileSync(this.filename, content);
    }
}
