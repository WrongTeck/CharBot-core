const fs = require("fs");
const CharBot = require("./CharBot");
class ConfigLoader {
  /**
   * Read config files
   * @param {CharBot} bot The instance of CharBot
   * @return {ConfigLoader}
   */
  constructor(bot, callback) {
    this.bot = bot;
    this.bot.emit("loadingConfig");
    this.loadConfig().then(config => {
      callback(config);
    });    
    return this;
  }
  loadConfig() {
    let config = {};
    return new Promise((resolve, reject) => {
      fs.readdir("./config", { encoding: "utf-8" }, (err, files) => {
        if(err) return this.bot.console.error(err) && reject(err);
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

module.exports = ConfigLoader;