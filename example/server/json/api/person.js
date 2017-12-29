import DB from '../../../src/database';

const PersonModel = DB.define({
    id: 0,
    name: {
        max_length: 10,
        null: false,
        verbose_name: 'Name',
        default: undefined,
        type: 'string'
    }
});

const PersonAPI = {
    model: PersonModel
};

module.exports = PersonAPI;
