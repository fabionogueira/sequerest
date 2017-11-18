export default class validate {
    private static validates:any = {};

    static getVerbose(name:string, def:any):string{
        return def.verbose_name ? def.verbose_name : name;
    }

    static set(name:string, callback:Function) {
        this.validates[name] = callback;
    }

    static get(name:string) {
        return this.validates[name];
    }
}

validate.set('max_length', (value:any, erros:Array<string>, def:any, name:string) => {
    let verbose = validate.getVerbose(name, def);
    if (value && (value.length > def.max_length)) erros.push(`the [${verbose}] field is too large`)
});

validate.set('null', (value:any, erros:Array<string>, def:any, name:string) => {
    let verbose = validate.getVerbose(name, def);
    if (value === '' || value === undefined || value === null) erros.push(`the [${verbose}] field is required`)
});

validate.set('type', (value:any, erros:Array<string>, def:any, name:string) => {
    let verbose = validate.getVerbose(name, def);
    let type = Object.prototype.toString.call(value).replace('[object ', '').replace(']', '').toLowerCase()
    if (type === null || type === undefined) return;
    if (type != def.type) erros.push(`the [${verbose}] data type field must be of type ${def.type}`)
});

validate.set('default', (value:any, erros:Array<string>, def:any, name:string) => {
    return (value === undefined || value === null || value === '') ? def.default : value;
});
