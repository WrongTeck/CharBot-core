const process = require('process');
const event_emitter = require('events');
const events = new event_emitter();
class ChairBot {
    constructor() {
        this.logger('info', 'Starting up...');
        this.commands();
        this.config = {};
        this.modules = {};
        this.plugins = {};
        this.pluginsloader();
        process.on('SIGINT',()=>{
            this.stop();
        });
    }
    commands(){
        const fs = require('fs');
        process.stdin.on('data', (data) => {
            data=data.toString().replace('\n', '');
            fs.appendFile(`./logs/${this.log}.log`, `> ${data}\n`, (err) => {
                if(err) return console.error(err) && process.exit(1);
            });
            switch (data) {
                case 'stop':
                    this.stop();
                    break;
                case 'plugins':
                    if(this.plugins == {}) {
                        for(let key in Object.keys(this.plugins)){
                            this.logger('info', `${this.plugins[Object.values(this.plugins)[key]].name}`);
                        }
                    } else {
                        this.logger('info', 'No plugin were loaded!');
                    }
                    break;
                case 'help':
                    this.logger('info', fs.readFileSync('./help.txt', 'utf8') );
                    break;
                case '':
                    this.logger('info', 'Type "help" for help!');
                    break;
                case 'clearlogs':
                    fs.readdir('./logs', (err, files)=>{
                        if(err){
                            this.logger('err', err);
                        }
                        else{
                            for(let i=0; i<files.length; i++){
                                if(files[i].toString()!==this.log+'.log'){
                                    fs.unlink('./logs/'+files[i],(err)=>{
                                        if(err){
                                            this.logger('err', err);
                                        }
                                    });
                                }
                            }
                            this.logger('info', 'Logs cleared!');
                        }
                    });
                    break;
                default:
                    this.logger('err1', `Unknown command: ${data}`);
                    break;
            }
        });
    }
    configloader(name) {
        const fs = require('fs');
        async function run(mongo, config) {
            try {
                await mongo.connect();
                let db = mongo.db(config.mongo.db);
                let res = await db.findOne({ type: 'config', config: `${name}` });
                return res;
            }
            finally {
                mongo.close();
            }
        }
        const data = fs.readFileSync('./config/main.json');
        const main = JSON.parse(data);
        if (main.mongo.enable && name !== "mongo") {
            this.mongoloader();
            return run(this.mongo, this.config.mongo);
        }
        else {
            const file = fs.readFileSync(`./config/${name}.json`);
            return JSON.parse(file);
        }
    }
    discordloader() {
        const config = this.configloader('discord');
        if (config && !this.discord) {
            const discord = require('discord.js');
            const client = new discord.Client();
            client.login(config.token);
            client.on('ready', () => {
                this.logger('info', `Discord is ready! Ping ${client.ws.ping}ms`);
            });
            if (config.debug) {
                client.on('debug', debug => {
                    this.logger('debug', debug);
                });
            }
            this.discord = client;
        } else {
            if(!config){
                this.logger('err1', 'Invalid discord config!');
                this.discord = false;
            }
        }
    }
    expressloader() {
        const config = this.configloader('express');
        if (config && !this.express) {
            this.config.express = config;
            const express = require("express");
            const app = express();
            app.listen(config.port, () => {
                this.logger('info', `Express is listening on ${config.port}`);
            });
            this.express = express;
            this.app = app;
        }
        else {
            if(!config){
                this.logger('err1', 'Invalid express config!');
                this.express = false;
                this.app=false;
            }
 }
    }
    websocket() {
        const config = this.configloader('websocket');
        if (config && !this.ws) {
            this.config.ws = config;
            const ws = require('ws');
            const wss = new ws.Server({
                path: config.path,
                server: this.app,
            });
            this.ws = wss;
            this.logger('info', `WebSocket ready!`);
        }
        else {
            if(!config){
                this.logger('err1', 'Invalid websocket config!');
                this.ws = false;
            }
        }
    }
    mongoloader() {
        const config = this.configloader('mongo');
        if (config.uri && !this.mongo) {
            this.config.mongo = config;
            const { MongoClient } = require('mongodb');
            this.mongo = new MongoClient(config.uri, config.options);
            this.logger('info', `MongoDB connector ready!`);
        }
        else {
            if(!config){
                this.logger('err1', 'Invalid mongo config!');
                this.mongo = false;
            }
        }
    }
    redisloader() {
        const config = this.configloader('redis');
        if (config.port && !this.redis) {
            this.config.redis = config;
            const ioredis = require('ioredis');
            const redis = new ioredis(config.port, config.host, config.options);
            this.redis = redis;
            this.logger('info', 'Redis connector ready!');
        }
        else {
            if(!config){
                this.logger('err1', 'Invalid redis config!');
                this.redis = false;
            }
        }
    }
    logger(type, message, cb) {
        const chalk = require('chalk');
        const moment = require('moment');
        const fs = require('fs');
        type = type.toUpperCase();
        if (!this.log) {
            this.log = moment().format(`HH-mm-ss`) + '-chairbot';
        }
        
                    message=message.toString();
                for(let i in message.split('\n')){
                    switch (type) {
                        case 'ERR2':
                            console.log(chalk.red(`[${time}] [GRAVE] ${message.split('\n')[i]}`));
                            break;
                        case 'ERR1':
                            console.log(chalk.red(`[${time}] [ERR] ${message.split('\n')[i]}`));
                            break;
                        case 'INFO':
                            console.log(chalk.white(`[${time}] [${type}] ${message.split('\n')[i]}`));
                            break;
                        case 'DEBUG':
                            console.log(chalk.gray(`[${time}] [${type}] ${message.split('\n')[i]}`));
                            break;
                        case "ML":
                            console.log(chalk.greenBright(`[${time}] [Module Loader] ${message.split('\n')[i]}`));
                            break;
                        case "MU":
                            console.log(chalk.redBright(`[${time}] [Module Unloader] ${message.split('\n')[i]}`));
                            break;
                        case "PL":
                            console.log(chalk.greenBright(`[${time}] [Plugin Loader] ${message.split('\n')[i]}`));
                            break;
                        case "PU":
                            console.log(chalk.redBright(`[${time}] [Plugin Unloader] ${message.split('\n')[i]}`));
                            break;
                        case 'FATAL':
                            console.log(chalk.bgRed.white(`[${time}] [${type}] ${message.split('\n')[i]}`));
                            break;
                        case "LOGGER":
                            console.log(chalk.bgGray.white(`[${time}] [${type}] ${message.split('\n')[i]}`));
                            break;
                        case 'G':
                            console.log(chalk.green(`[${time}] [INFO] ${message.split('\n')[i]}`));
                            break;
                        default:
                            console.log(chalk.red(`[${time}] [Unknown] ${message.split('\n')[i]}`));
                    }
                }
                if (type == "LOGGER") {
                    process.exit(1);
                }
                else if (type == 'FATAL') {
                        process.exit(1);
                }
                if(cb){
                    cb();
                }
                process.stdout.write('> ');
            });
        }
        log(this.log, time, type, message);
    }
    pluginsloader() {
        const fs = require('fs');
        fs.readdir('./plugins', (err, files) => {
            this.logger('PL', 'Loading plugins...');
            if (err)
                return this.logger('fatal', `Could not read the plugins folder! \n ${err}`);
            for (const key in files) {
                try {
                    if(!files[key].includes('.')){
                        let config = require(`./plugins/${files[key]}/plugin.json`);
                        if (config.enable) {
                            const { CPlugin } = require(`./plugins/${files[key]}/index.js`);
                            const p = new CPlugin(this);
                            p.main();
                            this.logger('PL', `Loaded ${config.name} ${config.version}`);
                        }
                    }
                }
                catch (error) {
                    this.logger('err1', `Could not load ${files[key]}\n ${error}`);
                }
            }
            this.logger('info', 'ChairBot is ready!');
        });
    }
    stop(){
        const fs = require('fs');
        this.logger('info', 'Shutting down...');
        fs.readdir('./plugins', (err, files) => {
            if (err)
                return this.logger('fatal', `Could not read the plugins folder! \n ${err}`);
            for (const key in files) {
                try {
                    if(!files[key].includes('.')){
                        const { CPlugin } = require(`./plugins/${files[key]}/index.js`);
                        const p = new CPlugin(this);
                        p.unload();
                        this.logger('PU', `Unloaded ${p.name}`);
                    }
                }
                catch (error) {
                    this.logger('err1', `Could not unload ${files[key]}\n ${error}`);
                }
            }
            this.logger('INFO', 'Bye!',()=>{
                process.exit(0);
            });
        });
    }
}
new ChairBot();