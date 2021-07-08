const discord=require('discord.js');
const client=new discord.Client();
const express=require('express');
const app=express();
const {Plugins,Modules}=require('./Plugins');
const ws = require('ws');
const usage = require('usage');
const fs=require('fs');
class ChairBot{
    constructor(cb){
        this.config=readconfig();
        this.discordload(this.config.discord,client=>{
            this.discord=client;
            this.express=this.expressload(this.config.express);
            this.ws=this.websocket(this.config.websocket);
            this.modules=this.moduleloader();
            this.pluginloader(plugins=>{
                this.plugins=plugins;
                cb(this);
            });
        });
    }
    discordload(config,cb){ //Pass the discord config only
        if(config && config.enable){
            client.login(config.token);
            client.on('ready',()=>{
                cb(client);
            });
        }else{
            cb("");
        }
    }
    expressload(config){
        if(config && config.enable){
            app.listen(config.port,()=>{
                console.log('Listening on '+config.port);
            });
            return {
                express:express,
                app:app
            };
        }
    }
    websocket(config,express){
        if(config && config.enable){
            if(!express) throw new Error('Could not start the WebSocket without express!');
            const wss = new ws.Server({ port: config.port, path: config.path, server:express });
            wss.on('connection', (connection, req) => {
                connection.on('ping', (data) => {
                    connection.pong(data);
                });
                connection.on('message', (data) => {
                    switch (data) {
                        case "shutdown":
                            connection.send('The bot will shutdown in few seconds');
                            process.exit(0);
                            break;
                        case "status":
                            usage.lookup(process.pid, (err, result) => {
                                connection.send(`CPU: ${Math.trunc(result.cpu)}%\nRAM: ${Math.floor(result.memory / (1024 * 1024))}MB\nPing: ${client.ws.ping}ms`);
                            });
                            break;
                        default:
                            connection.send("I don't know what is this! Use help to view the help");
                            break;
                    }
                });
            });
            return wss;
        }
    }
    pluginloader(cb){
        /*fs.readdir('./plugins',{encoding:'utf-8'},(err,files)=>{
            if(err) throw new Error('Could not read the plugins directory!\nError:\n'+err);
            var plugins="";
            for (const key in files) {
                if(!files[key].toString().includes('.')){
                    try{
                        const {Plugin}=require(`./plugins/${files[key]}/index.js`);
                        const loaded=new Plugin();
                        loaded.main(this);
                        if(!plugins){
                            plugins=`"${files[key]}":${loaded.unload()}`;
                        }else{
                            plugins=plugins+`,"${files[key]}":${JSON.parse(loaded)}`;
                        }
                    }catch(e){
                        console.error(`Could not load ${files[key]}:\n${e}`);
                    }
                }
            }
            return JSON.parse(`{${plugins}}`);
        });*/
        new Plugins(this,(plugins)=>{
            cb(plugins);
        });
    }
    moduleloader(){
        fs.readdir(__dirname+'/modules',{encoding:'utf-8'},(err,files)=>{
            if(err) throw new Error('Could not read the plugins directory!');
            var modules=new Array([]);
            for (const key in files) {
                if(!modules[key].includes('.')){
                    modules.push(module);
                }
            }
            let ok=new Modules(modules);
            return {
                modules:ok
            };
        });
    }
}
/* 
* Config Loader 
*/
    function require_ifexist(name){
        return fs.readFileSync(`./config/${name}.json`);
    }
    function readconfig(){
        var files=fs.readdirSync('./config');
        var config="";
        for(let key in files) {
                if(files[key].endsWith('.json')){
                let c=files[key].replace('.json','');
                let t=require_ifexist(c);
                if(!config){
                    config=`"${c}":${t}`;
                }else{
                    config=config+`,"${c}":"${t}"`;
                }
            }
        }
        return JSON.parse(`{${config}}`);
    }
module.exports={ChairBot};