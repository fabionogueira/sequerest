const {db} = require('../db/db')
const {User} = require('../db/models')

exports.pessoa = {
    auth: true,
    database: db,
    model: User,

    // override GET /path/to/api/ Create, Read, Update, Delete
    // read(req:any, res:any) {
    //     res.status(200).json({a:123})
    // }
}
