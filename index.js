class ChairBot {
    constructor() {
        this.config={};
        this.modules={};
        this.plugins={};
        this.modulesloader();
        this.pluginsloader();
    }
    configloader(name) {
        const fs = require('fs');
        async function run(mongo,config){
            try {
                await mongo.connect();
                let db=mongo.db(config.mongo.db);
                let res=await db.findOne({type:'config',config:`${name}`});
                return res;
            } finally {
                mongo.close();
            }
        }
        const data=fs.readFileSync('./config/main.json');
        const main = JSON.parse(data);
            if (main.mongo.enable && name !== "mongo") {
                this.mongoloader();
                return run(this.mongo,this.config.mongo);
            } else {
                    const file=fs.readFileSync(`./config/${name}.json`);
                    return JSON.parse(file);
            }
    }
    discordloader() {
        const config=this.configloader('discord');
        if (config && !this.discord) {
            const discord = require('discord.js');
            this.logger('err',"ddd");
            const client = new discord.Client();
            client.login(config.token);
            client.on('ready', () => {
                this.logger('info',`Discord is ready! Ping ${client.ws.ping}ms`);
            });
            this.discord=client;
        } else {
            this.logger('err','Invalid discord config!');
            return 'err';
        }
    }
    expressloader() {
        const config = this.configloader('express');
        if (config && !this.express) {
            this.config.express=config;
            const express = require("express");
            const app = express();
            app.listen(config.port, () => {
                this.logger('info',`Express is listening on ${config.port}`);
            });
            this.express = express;
            this.app = app;
        } else {
            return 'err';
        }
    }
    websocket() {
        const config = this.configloader('websocket');
        if (config && !this.ws) {
            this.config.ws=config;
            const ws = require('ws');
            const wss = new ws.Server({
                path: config.path,
                server: this.app,
            });
            this.ws=wss;
        } else {
            return 'err';
        }
    }
    mongoloader() {
        const config = this.configloader('mongo');
        if (config.uri && !this.mongo) {
            this.config.mongo=config;
            const {
                MongoClient
            } = require('mongodb');
            this.mongo = new MongoClient(config.uri, config.options);
        } else {
            return "err";
        }
    }
    redisloader() {
        const config = this.configloader('redis');
        if (config.port && !this.redis) {
            this.config.redis=config;
            const ioredis = require('ioredis');
            const redis = new ioredis(config.port, config.host, config.options);
            this.redis = redis;
        } else {
            return "err";
        }
    }
    logger(type, message) {
        type = type.toUpperCase();
        console.log(new Date().toUTCString() + ` [${type}] ${message}`);
    }
    pluginsloader(){
        const fs=require('fs');
        fs.readdir('./plugins',(err,files)=>{
            if(err) return this.logger('err',`Could not read the plugins folder! \n Error ${err}`);
            for (const key in files) {
                try {
                    const {Plugin}=require(`./plugins/${files[key]}/index.js`);
                    const p=new Plugin(this);
                    p.main(this);
                } catch (error) {
                    this.logger('err',`Could not load ${files[key]}\nError: ${error}`);
                }
            }
        });
    }
    modulesloader(){
        const fs = require('fs');
        fs.readdir('./modules',(err,files)=>{
            if(err) return this.logger('err',`Could not read the modules folder! \nError: ${err}`);
            for (const key in files) {
                try {
                    const m=require(`./modules/${files[key]}/index.js`);
                    m.main(this);
                } catch (error) {
                    this.logger('err',`Could not load ${files[key]}\nError: ${error}`);
                }
            }
        });
    }
}
new ChairBot();