const fs = require("fs");

class Plugins{
/*    constructor(plugins){
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
*/
    constructor(chairbot){
        if(chairbot){
            this.plugins=this.loader(chairbot);
        }
    }
    load(plugin_name,chairbot){
        eval(`this.plugins.${plugin_name}.main(${chairbot})`);
    }
    loader(chairbot){
        fs.readdir('./plugins',{encoding:'utf-8'},(err,files)=>{
            if(err) throw new Error('Could not read the plugins directory!\nError:\n'+err);
            var plugins="";
            for (const key in files) {
                if(!files[key].toString().includes('.')){
                    try{
                        const {Plugin}=require(`./plugins/${files[key]}/index.js`);
                        const loaded=new Plugin(chairbot);
                        if(!plugins){
                            plugins=`"${files[key]}":${JSON.parse(loaded)}`;
                        }else{
                            plugins=plugins+`,"${files[key]}":${JSON.parse(loaded)}`;
                        }
                    }catch(e){
                        console.error(`Could not load ${files[key]}:\n${e}`);
                    }
                }
            }
            return JSON.parse(`{${plugins}}`);
        });
    }
    unloader(plugin_name){
        try{
            const {Plugin}=require(`./plugins/${plugin_name}/index.js`);
            const unloader=new Plugin();
            unloader.unload();
        }catch(e){
            console.error(`The plugin doesn't exist or there was a problem while unloading it.\n${e}`);
        }
    }
}
class Modules{
    constructor(){

    }
}
module.exports={Plugins,Modules};