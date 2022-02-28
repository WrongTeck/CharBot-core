import { EventEmitter2 } from "eventemitter2";
import { ConfigManager } from "./ConfigManager";
import ChairConsole from "./Console";
import ModuleManager from "./ModuleManager";
import PluginManager from "./PluginManager";
import { Configs, Lang, ChairModules, ChairPlugins } from "../interfaces";
const version = "0.1 - ALPHA";
export class ChairWoom extends EventEmitter2 {
  console: ChairConsole;
  lang: Lang;
  config: Configs;
  plugins: ChairPlugins;
  modules: ChairModules;
  /**
   * Initialize a new ChairWoom instance
   * @returns The ChairWoom instance
   */
  constructor() {
    super({ wildcard: true });
    return this;
  }
  /**
   * Starts the bot
   */
  start(): ChairWoom {
    this.emit("core.start");
    this.console = new ChairConsole(this);
    new ConfigManager(this, (config: Configs) => {
      this.config = config;
      this.reloadLang();
      this.console.log(this.lang.bot_banner_start, {version});
      this.modules = new ModuleManager(this).modules;
    });
    this.on("core.modules.finish", () => {
      this.plugins = new PluginManager(this).plugins;
    });
    this.on("core.plugins.finish", () => {
      this.emit("core.finish");
      this.console.log(this.lang.done);
    });
    return this;
  }
  /**
   * Reload all languages files
   */
  reloadLang() {
    this.emit("core.lang.reload");
    this.lang = {};
    Object.assign(this.lang, require(__dirname + `/../languages/${this.config.core.lang}.json`));
  }
  /**
   * Stops the bot
   */
  stop() {
    this.console.log(this.lang.commands.shutdown_message);
    this.emit("core.shutdown");
    this.console.lastCons.abort();
    process.stdout.clearLine(0);
    process.stdout.clearLine(1);
    for(let ChairModule in this.modules) {
      if(this.modules[ChairModule].unload)
        this.modules[ChairModule].unload();
    }
    for(let ChairPlugin in this.plugins) {
      if(this.plugins[ChairPlugin].unload)
        this.plugins[ChairPlugin].unload();
    }
    setTimeout(() => {
      this.console.term.clear();
      process.exit(0);
    }, 1000);
  }
}

export default ChairWoom;