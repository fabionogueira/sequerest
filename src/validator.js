
let _validates = {};

class Validator {
    
    constructor(){
    }

    static getVerbose(name, def){
        return def.verbose_name ? def.verbose_name : name;
    }

    static set(name, callback) {
        _validates[name] = callback;
    }

    static get(name) {
        return _validates[name];
    }
}

Validator.set('max_length', (value, erros, def, name) => {
    let verbose = Validator.getVerbose(name, def);
    if (value && (value.length > def.max_length)) erros.push(`the [${verbose}] field is too large`);
});

Validator.set('null', (value, erros, def, name) => {
    let verbose = Validator.getVerbose(name, def);
    if (value === '' || value === undefined || value === null) erros.push(`the [${verbose}] field is required`);
});

Validator.set('type', (value, erros, def, name) => {
    let verbose = Validator.getVerbose(name, def);
    let type = Object.prototype.toString.call(value).replace('[object ', '').replace(']', '').toLowerCase();
    if (type === null || type === undefined) return;
    if (type != def.type) erros.push(`the [${verbose}] data type field must be of type ${def.type}`);
});

Validator.set('default', (value, erros, def) => {
    return (value === undefined || value === null || value === '') ? def.default : value;
});

module.exports = Validator;