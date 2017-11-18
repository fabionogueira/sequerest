import {Database} from '../../src/database'
import config from '../config'

export default new Database(config.database);