import { readdir } from "fs";
import CharBot from "./CharBot";
// Needs a more modular rewrite
export class ConfigManager {
  config: Object;
  bot: CharBot;
  /**
   * Initialize a new instance of the ConfigManager
   * @param bot The CharBot instance that called it
   * @param callback Returns when the configs are ready
   * @returns The ConfigManager
   */
  constructor(bot: CharBot, callback: Function) {
    this.bot = bot;
    this.bot.emit("loadingConfig", null);
    this.loadConfig().then((config) => {
      callback(config);
    });
    return this;
  }
  /**
   * Load all configs from the config folder
   * @returns A promise with the config
   */
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
  /**
   * Reloads configs in the bot
   */
  reloadConfig() {
    this.bot.emit("reloadingConfig");
    this.config = {};
    this.loadConfig();
    this.bot.emit("configReloaded");
  }
  /**
   * Unloads a specific config from the bot
   * @param name The config name
   */
  unloadConfig(name) {
    this.bot.emit("unloadingConfig", name);
    delete this.bot.config[name];
    this.bot.emit("configUnloaded", name);
  }
}