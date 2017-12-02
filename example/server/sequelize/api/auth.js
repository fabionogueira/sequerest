const {db} = require('../db/db')
const {Auth} = require('../../src/auth')

exports.auth = {
    routers: {
        "POST /api/auth/"(req, res) {
            res.status(200).json(req.body)
        }
    }
}
