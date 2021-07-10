const fs = require("fs");

class Plugins{
    constructor(chairbot,cb){
        if(chairbot){
            this.chairbot=chairbot;
            this.loader(chairbot,()=>{
                cb(this.plugins);
            });
        }
    }
    loader(chairbot,cb){
        fs.readdir('./plugins',{encoding:'utf-8'},(err,files)=>{
            if(err) throw new Error('Could not read the plugins directory!\nError:\n'+err);
            this.plugins={};
            for (const key in files) {
                if(!files[key].toString().includes('.')){
                    try{
                        const {Plugin}=require(`../plugins/${files[key]}/index.js`);
                        let pl=new Plugin(chairbot);
                        pl.main(chairbot);
                        console.log(`Loaded ${files[key]}`);
                    }catch(e){
                        console.error(`Could not load ${files[key]}:\n${e}`);
                    }
                }
            }
            cb();
        });
    }
    require(name){
        switch(name){
            case "discord":
                if(!this.discord){
                    this.chairbot.discordload();
                    this.discord=true;
                }
                break;
            case "express":
                if(!this.express){
                    this.chairbot.expressload();
                    this.express=true;
                }   
                break;
            case "ws":
                if(!this.ws){
                    this.chairbot.websocket();
                    this.ws=true;
                }
                break;
            case "mongo":
                if(!this.mongo){
                    this.chairbot.mongo_con();
                    this.mongo=true;
                }
                break;
            case "redis":
                if(!this.redis){
                    this.chairbot.redis_con();
                    this.redis=true;
                }
                break;
            default:
                console.log(`[WARN] A plugin tryed to require ${name} but is not a valid name`);
                break;
            }
    }
}
module.exports={Plugins};