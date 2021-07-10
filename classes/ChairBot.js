const { Plugins } = require("./Plugins");
const fs = require("fs");
const ioredis = require("ioredis");
class ChairBot {
    constructor(cb) {
        this.config={};
        /*this.mongo(this.config.mongodb);
            this.discordload(this.config.discord,client=>{
                this.discord=client;
                this.express=this.expressload(this.config.express);
                this.ws=this.websocket(this.config.websocket);
                this.moduleloader();
                this.pluginloader(plugins=>{
                    this.plugins=plugins;
                    cb(this);
                });
            });*/
            this.moduleloader();
            this.pluginloader(()=>{
                cb(this);
            });
    }
    discordload() {
        const config = require_ifexist("discord");
        if (config) {
            this.config.discord=config;
            const discord = require("discord.js");
            const client = new discord.Client();
            client.login(config.token);
            client.on("ready", () => {
                console.log(`[INFO] Discord is ready! Ping ${client.ws.ping}ms`);
            });
            this.discord = client;
        }
    }
    expressload() {
        const express = require("express");
        const app = express();
        const config = require_ifexist("express");
        if (config) {
            this.config.express=config;
            app.listen(config.port, () => {
                console.log(`[INFO] Express listening on ${config.port}`);
            });
            this.express = express;
            this.express.app = app;
        }
    }
    websocket() {
        const config = require_ifexist("websocket");
        if (config) {
            this.config.ws=config;
            const ws = require("ws");
            const usage = require("usage");
            if (!this.express)
                throw new Error("Could not start the WebSocket without express!");
            const wss = new ws.Server({
                port: config.port,
                path: config.path,
                server: express,
            });
            wss.on("connection", (connection, req) => {
                connection.on("ping", (data) => {
                    connection.pong(data);
                });
                connection.on("message", (data) => {
                    switch (data) {
                        case "shutdown":
                            connection.send("The bot will shutdown in few seconds");
                            process.exit(0);
                            break;
                        case "status":
                            usage.lookup(process.pid, (err, result) => {
                                connection.send(
                                    `CPU: ${Math.trunc(result.cpu)}%\nRAM: ${Math.floor(result.memory / (1024 * 1024))}MB\nPing: ${client.ws.ping}ms`
                                );
                            });
                            break;
                        default:
                            connection.send(
                                "I don't know what is this! Use help to view the help"
                            );
                            break;
                    }
                });
            });
            this.ws = wss;
        }
    }
    mongo_con() {
        const config = require_ifexist("mongodb");
        if (config) {
            this.config.mongo=config;
            const {
                MongoClient
            } = require("mongodb");
            const mongo = new MongoClient(config.uri);
            this.mongo = mongo;
        }
    }
    redis_con() {
        if (config) {
            this.config.redis=config;
            const redis = new ioredis(config.port, config.host);
            if (config.username && config.passwrd) {
                redis.auth(config.username, config.password, (err, res) => {
                    if (err)
                        throw new Error("Unable to authenticate in the rdeis server");
                    this.redis = res;
                    return;
                });
            }
            this.redis = redis;
        }
    }
    pluginloader(cb) {
        new Plugins(this, (plugins) => {
            this.plugins = plugins;
            cb();
        });
    }
    moduleloader() {
        const files = fs.readdirSync("./modules");
        this.modules = {};
        try {
            for (const key in files) {
                if (!files[key].includes(".")) {
                    let t = require(`../modules/${files[key]}/index.js`);
                    t.main(this);
                }
            }
        } catch (error) {
            console.log(`Could not load Modules \n ${error}`);
        }
    }
}
/*
 * Config Loader
 */
async function require_ifexist(name) {
    /*return fs.readFileSync(`./config/${name}.json`);*/
    await fs.readFile(`./config/${name}.json`, (e, data) => {
        if (e) return "";
        return data;
    });
}

function readconfig() {
    var files = fs.readdirSync("./config");
    var config = "";
    for (let key in files) {
        if (files[key].endsWith(".json")) {
            let c = files[key].replace(".json", "");
            let t = require_ifexist(c);
            if (!config) {
                config = `"${c}":${t}`;
            } else {
                config = config + `,"${c}":"${t}"`;
            }
        }
    }
    return JSON.parse(`{${config}}`);
}
module.exports = {
    ChairBot
};