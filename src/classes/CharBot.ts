import { EventEmitter2 } from "eventemitter2";
import { ConfigManager } from "./ConfigManager";
import CharConsole from "./Console";
import ModuleManager from "./ModuleManager";
import PluginManager from "./PluginManager";
import { Configs, Lang, CharModules, CharPlugins } from "../interfaces";
const version = "0.1 - ALPHA";
export class CharBot extends EventEmitter2 {
  console: CharConsole;
  lang: Lang;
  config: Configs;
  plugins: CharPlugins;
  modules: CharModules;
  /**
   * Initialize a new CharBot instance
   * @returns The CharBot instance
   */
  constructor() {
    super({ wildcard: true });
    return this;
  }
  /**
   * Starts the bot
   */
  start(): CharBot {
    this.console = new CharConsole(this);
    new ConfigManager(this, (config: Configs) => {
      this.config = config;
      this.reloadLang();
      this.console.log(this.lang.bot_banner_start, {version});
      this.modules = new ModuleManager(this).modules;
    });
    this.on("modulesLoaded", () => {
      this.plugins = new PluginManager(this).plugins;
    });
    this.on("pluginsLoaded", () => {
      this.emit("ready");
      this.console.log(this.lang.done);
    });
    return this;
  }
  /**
   * Reload all languages files
   */
  reloadLang() {
    this.emit("langReload")
    this.lang = {};
    Object.assign(this.lang, require(__dirname + `/../languages/${this.config.core.lang}.json`));
  }
  /**
   * Stops the bot
   */
  stop() {
    this.console.log(this.lang.commands.shutdown_message);
    this.emit("shutdown");
    this.console.lastCons.abort();
    process.stdout.clearLine(0);
    process.stdout.clearLine(1);
    for(let charModule in this.modules) {
      if(this.modules[charModule].unload)
        this.modules[charModule].unload();
    }
    for(let charPlugin in this.plugins) {
      if(this.plugins[charPlugin].unload)
        this.plugins[charPlugin].unload();
    }
    setTimeout(() => {
      this.console.term.clear();
      process.exit(0);
    }, 1000);
  }
}

export default CharBot;