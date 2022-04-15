import { readdir } from "fs";
import { Configs } from "../interfaces";
import ChairWoom from "./ChairWoom";
/**
 * Loads and inject the config file in the main class
 */
export class ConfigManager {
  /**
   * The config files
   */
  config: Configs;
  /**
   * Initialize a new instance of the ConfigManager
   * @param bot The ChairWoom instance that called it
   * @param callback Returns when the configs are ready
   * @returns The ConfigManager
   */
  constructor(private bot: ChairWoom, callback: Function) {
    this.bot = bot;
    this.bot.emit("core.config.start");
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
          this.bot.emit("core.config.err");
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
        this.bot.emit("core.config.finish");
        resolve(config);
      });
    });
  }
  /**
   * Reloads configs in the bot
   */
  reloadConfig() {
    this.bot.emit("core.config.reload");
    this.config = {};
    this.loadConfig();
    this.bot.emit("core.config.reloaded");
  }
  /**
   * Unloads a specific config from the bot
   * @param name The config name
   */
  unloadConfig(name: string) {
    this.bot.emit("core.config.unload", name);
    delete this.bot.config[name];
    this.bot.emit("core.config.unloaded", name);
  }
}