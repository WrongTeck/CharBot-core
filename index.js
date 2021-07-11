class ChairBot {
    constructor() {
        this.config={};
        this.modules={};
        this.plugins={};
        this.modulesloader();
        this.pluginsloader();
    }
    async configloader(name) {
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
        fs.readFile('./config/main.json', {
            encoding: 'utf-8'
        }, (err, data) => {
            if (err) this.logger('err',`main.json is REQUIRED to start the bot!\n Error: ${err}`);
            const main = JSON.parse(data);
            if (main.mongo.enable && name !== "mongo") {
                this.mongoloader();
                return run(this.mongo,this.config.mongo);
            } else {
                fs.readFile(`./config/${name}.json`, {
                    encoding: 'utf-8'
                }, (err, data) => {
                    if (err) {
                        this.logger('err',`Could not load ${name}.json from config folder!`);
                        return "";
                    }
                    return JSON.parse(data);
                });
            }
        });
    }
    async discordloader(cb) {
        const config = await this.configloader('discord');
        if (config.token && !this.discord) {
            const {
                Client
            } = require('discord.js');
            const client = new Client();
            client.on('ready', () => {
                this.logger('info',`Discord is ready! Ping ${client.ws.ping}ms`);
            });
            return client;
        } else {
            this.logger('err','Invalid discord config!');
            return 'err';
        }
    }
    async expressloader() {
        const config = await this.configloader('express');
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
    async websocket() {
        const config = await this.configloader('websocket');
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
    async mongoloader() {
        const config = await this.configloader('mongo');
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
    async redisloader() {
        const config = await this.configloader('redis');
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
        console.log(new Date().toUTCString() + `${type} ${message}`);
    }
    pluginsloader(){
        const fs=require('fs');
        fs.readdir('./plugins',(err,files)=>{
            if(err) return this.logger('err',`Could not read the plugins folder! \n Error ${err}`);
            for (const key in files) {
                try {
                    const {Plugin}=require(`./plugins/${files[key]}/index.js`);
                    new Plugin(this,(main)=>{
                        main();
                    });
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