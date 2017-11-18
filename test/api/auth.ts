import MyDB from '../db/mydb';
import Auth from '../../src/auth';

export default {
    routers: {
        "POST /api/auth/"(req:any, res:any) {
            res.status(200).json(req.body)
        }
    }
}
