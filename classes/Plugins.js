const fs = require("fs");

class Plugins{
    constructor(chairbot,cb){
        if(chairbot){
            this.loader(chairbot,(loaded)=>{
                cb(this.plugins);
            });
        }
    }
    loader(chairbot,cb){
        fs.readdir('./plugins',{encoding:'utf-8'},(err,files)=>{
            if(err) throw new Error('Could not read the plugins directory!\nError:\n'+err);
            var loaded={};
            for (const key in files) {
                if(!files[key].toString().includes('.')){
                    try{
                        const {Plugin}=require(`../plugins/${files[key]}/index.js`);
                        let pl=new Plugin(chairbot);
                        pl.main(chairbot,loaded);
                        console.log(`Loaded ${files[key]}`);
                    }catch(e){
                        console.error(`Could not load ${files[key]}:\n${e}`);
                    }
                    if(!this.plugins){
                        this.plugins=loaded;
                    }else{
                        this.plugins=this.plugins+loaded;
                    }
                }
            }
            cb(this.plugins);
        });
    }
}
module.exports={Plugins};