import MyDB from '../db/mydb';

export default {
    auth: true,
    database: MyDB,
    model: {
        id: 0,
        name: {
            max_length: 10,
            null: false,
            verbose_name: 'Name',
            default: undefined,
            type: 'string'
        }
    },

    // override GET /path/to/api/ Create, Read, Update, Delete
    // read(req:any, res:any) {
    //     res.status(200).json({a:123})
    // }
}
