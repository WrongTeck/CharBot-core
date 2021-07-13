class ChairBot {
    config:any;
    modules:object;
    plugins:object;
    ws;
    mongo;
    app;
    redis;
    express;
    discord;
    log:string;
    public constructor() {
        this.config={};
        this.modules={};
        this.plugins={};
        this.modulesloader();
        this.pluginsloader();
    }
    private configloader(name) {
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
    public discordloader() {
        const config=this.configloader('discord');
        if (config && !this.discord) {
            const discord = require('discord.js');
            this.logger('err',"ddd");
            const client = new discord.Client();
            client.login(config.token);
            client.on('ready', () => {
                this.logger('info',`Discord is ready! Ping ${client.ws.ping}ms`);
            });
            if(config.debug){
                client.on('debug',debug=>{
                    this.logger('debug',debug);
                });
            }
            this.discord=client;
        } else {
            this.logger('err','Invalid discord config!');
            return 'err';
        }
    }
    public expressloader() {
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
    public websocket() {
        const config = this.configloader('websocket');
        if (config && !this.ws) {
            this.config.ws=config;
            const ws = require('ws');
            const wss = new ws.Server({
                path: config.path,
                server: this.app,
            });
            this.ws=wss;
            this.logger('info',`WebSocket ready!`);
        } else {
            this.ws= 'err';
        }
    }
    public mongoloader() {
        const config = this.configloader('mongo');
        if (config.uri && !this.mongo) {
            this.config.mongo=config;
            const {
                MongoClient
            } = require('mongodb');
            this.mongo = new MongoClient(config.uri, config.options);
            this.logger('info',`MongoDB connector ready!`);
        } else {
            this.mongo= "err";
        }
    }
    public redisloader() {
        const config = this.configloader('redis');
        if (config.port && !this.redis) {
            this.config.redis=config;
            const ioredis = require('ioredis');
            const redis = new ioredis(config.port, config.host, config.options);
            this.redis = redis;
            this.logger('info','Redis connector ready!');
        } else {
            this.redis= "err";
        }
    }
    public logger(type, message) {
        const chalk=require('chalk');
        const moment=require('moment');
        const fs = require('fs');
        type = type.toUpperCase();
        if(!this.log){
            this.log=moment().format(`HH-mm-ss`)+'-chairbot';
        }
        const time=moment().format('HH:mm:ss');
        switch(type){
            case 'ERR2':
                console.log(chalk.red(`${time} [${type}] ${message}`));
                break;
            case 'INFO':
                console.log(chalk.white(`${time} [${type}] ${message}`));
                break;
            case 'DEBUG':
                console.log(chalk.gray(`${time} [${type}] ${message}`));
                break;
            case "ML":
                console.log(chalk.greenBright(`[${time}] [Module Loader] ${message}`));
                break;
            case "MU":
                console.log(chalk.redBright(`[${time}] [Module Unloader] ${message}`));
                break;
            case "PL":
                console.log(chalk.greenBright(`[${time}] [Plugin Loader] ${message}`));
                break;
            case "PU":
                console.log(chalk.redBright(`[${time}] [Plugin Unloader] ${message}`));
                break;
            case 'FATAL':
                console.log(chalk.bgRed.white(`[${time}] [${type}] ${message}`));
                break;
            case "LOGGER":
                console.log(chalk.bgGray.white(`[${time}] [${type}] ${message}`));
                break;
            case 'G':
                console.log(chalk.green(`[${time}] [INFO] ${message}`));
                break;
            default:
                console.log(chalk.red(`[${time}] [Unknown] ${message}`));
        }
        if(type=="LOGGER"){
            process.exit(1);
        }else if(type=='FATAL'){
           log(this.log,time,type,message,()=>{
               process.exit(1);
            });
        }
        function log(log,time,type,message,cb){
            fs.appendFile(`./logs/${log}.log`,`[${time}] [${type}] ${message}\n`,(err)=>{
                if(err){
                    fs.mkdir('./logs',(err=>{
                        if(err){
                            if(cb){
                                cb();
                            }
                        }
                        if(cb){
                            cb();
                        }
                    }));
                }
                if(cb){
                    cb();
                }
            });
        }
        log(this.log,time,type,message,()=>{});
    }
    pluginsloader(){
        const fs=require('fs');
        fs.readdir('./plugins',(err,files)=>{
            if(err) return this.logger('fatal',`Could not read the plugins folder! \n ${err}`);
            for (const key in files) {
                try {
                    const {Plugin}=require(`./plugins/${files[key]}/index.js`);
                    const p=new Plugin(this);
                    p.main(this);
                    this.logger('PL',`Loaded ${p.name}`);
                } catch (error) {
                    this.logger('err',`Could not load ${files[key]}\n ${error}`);
                }
            }
        });
    }
    modulesloader(){
        const fs = require('fs');
        fs.readdir('./modules',(err,files)=>{
            if(err) return this.logger('fatal',`Could not read the modules folder! \n ${err}`);
            for (const key in files) {
                try {
                    const {Module}=require(`./modules/${files[key]}/index.js`);
                    const m=new Module(this);
                    this.logger('ML',`Loaded ${m.name}`);
                } catch (error) {
                    this.logger('err',`Could not load ${files[key]}\n ${error}`);
                }
            }
        });
    }
}
new ChairBot();
