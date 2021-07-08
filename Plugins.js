const fs = require("fs");

class Plugins{
    constructor(chairbot,cb){
        if(chairbot){
            this.loader(chairbot,(loaded)=>{
                console.log(`Loaded ${loaded} plugins!`);
                cb(this.plugins);
            });
        }
    }
    loader(chairbot,cb){
        fs.readdir('./plugins',{encoding:'utf-8'},(err,files)=>{
            if(err) throw new Error('Could not read the plugins directory!\nError:\n'+err);
            var plugins=0;
            var loaded={};
            for (const key in files) {
                if(!files[key].toString().includes('.')){
                    try{
                        const {Plugin}=require(`./plugins/${files[key]}/index.js`);
                        let pl=new Plugin(chairbot);
                        pl.main(chairbot,loaded);
                        plugins++;
                    }catch(e){
                        console.error(`Could not load ${files[key]}:\n${e}`);
                    }
                    this.plugins=loaded;
                }
            }
            cb(plugins);
        });
    }
}
class Modules{
    constructor(){
        
    }
}
module.exports={Plugins,Modules};