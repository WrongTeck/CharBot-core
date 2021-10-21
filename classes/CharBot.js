const version = "0.1-ALPHA";
const Console = require("./Console");
const EventEmitter = require("events");
const config = require("../config/main.json");
const fs = require("fs");
const PluginLoader = require("./PluginLoader");

class CharBot extends EventEmitter {
  constructor() {
    super({captureRejections: true});
    /**
     * Create a Console Instance
     * @type {Console}
     */
    this.console = new Console(require("./Commands").Commands, this);
    /**
     * Contain the language data
     * @type {Object}
     */
    this.lang = { "lang": config.lang };
    fs.access(__dirname + `/../languages/${config.lang}.json`, fs.constants.R_OK, (err) => {
      if (err && !config.debug) return this.console.fatal("Wrong lang configuration! Check the docs!");
      if(err) return this.console.fatal(err);
    });
    Object.assign(this.lang, require(__dirname + `/../languages/${config.lang}.json`));
    this.console.log(this.lang.bot_banner_start, { version: version });
    this.pluginLoad();
    this.emit("ready")
    return this;
  }
  reloadLang() {
    Object.assign(this.lang, require(__dirname + `/../languages/${config.lang}.json`));
    // Here should reload lang files from plugins and modules
  }
  pluginLoad() {
    this.plugins = new PluginLoader(this).plugins;
  }
}
module.exports = CharBot;
