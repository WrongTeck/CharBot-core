class Plugins{
    constructor(plugins){
        if(!Array.isArray(plugins)){
            throw new Error("The plugins var must be an array!");
        }
        this.v=this.load(plugins);
        return { plugins:plugins };
    }
    load(plugins){
        var p="";
        for (const key in plugins) {
            let name=plugins[key].name;
            let plugin=plugins[key];
            if(!p){
                p=`"${name}":"${plugin}"`;
            }else{
                p=p+`,"${name}":"${plugin}"`;
            }
        }
        if(p){
            return JSON.parse(`{${p}}`);
        }else{
            return JSON.parse({disabled:1});
        }
    }
    unload(plugin_name){
        eval(`this.v.${plugin_name}={}`);
    }
}
module.exports={Plugins};