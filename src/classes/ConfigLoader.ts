import { readdir } from "fs";
import CharBot from "./CharBot";

export class ConfigLoader {
  config: Object;
  bot: CharBot;
  constructor(bot: CharBot, callback: Function) {
    this.bot = bot;
    this.bot.emit("loadingConfig", null);
    this.loadConfig().then((config) => {
      callback(config);
    });
    return this;
  }
  loadConfig() {
    let config = {
      reloadConfig: null,
      unloadConfig: null,
      loadConfig: null,
    };
    return new Promise((resolve, reject) => {
      readdir("./config", { encoding: "utf-8" }, (err, files) => {
        if(err) {
          this.bot.console.error(err.message)
          return reject(err);
        }
        files.forEach(file => {
          if(file.endsWith(".json")) {
            config[file.replace(".json", "")] = require(`../config/${file}`);
          }
        });
        config.reloadConfig = this.reloadConfig;
        config.unloadConfig = this.unloadConfig;
        config.loadConfig = this.loadConfig;
        this.bot.emit("configLoaded");
        resolve(config);
      });
    });
  }
  reloadConfig() {
    this.bot.emit("reloadingConfig");
    this.config = {};
    this.loadConfig();
    this.bot.emit("configReloaded");
  }
  unloadConfig(name) {
    this.bot.emit("unloadingConfig", name);
    delete this.bot.config[name];
    this.bot.emit("configUnloaded", name);
  }
}