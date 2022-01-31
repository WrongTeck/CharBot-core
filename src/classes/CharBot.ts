import { EventEmitter2 } from "eventemitter2";
import { ConfigLoader } from "./ConfigLoader";
import CharConsole from "./Console";
import ModuleLoader, { CharModules } from "./ModuleLoader";
import PluginLoader, { CharPlugins } from "./PluginLoader";
const version = "0.1 - ALPHA";
export class CharBot extends EventEmitter2 {
  console: CharConsole;
  lang: Lang;
  config: Configs;
  plugins: CharPlugins;
  modules: CharModules;
  constructor() {
    super({ wildcard: true });
    return this;
  }
  /**
   * Starts the bot
   */
  start(): CharBot {
    this.console = new CharConsole(this);
    new ConfigLoader(this, (config) => {
      this.config = config;
      this.reloadLang();
      this.console.log(this.lang.bot_banner_start, {version});
      this.modules = new ModuleLoader(this).modules;
    });
    this.on("modulesLoaded", () => {
      this.plugins = new PluginLoader(this).plugins;
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
    this.lang = {};
    Object.assign(this.lang, require(__dirname + `/../languages/${this.config.core.lang}.json`));
  }
  /**
   * Stops the bot
   */
  stop() {
    this.console.log(this.lang.commands.shutdown_message);
    this.console.lastCons.abort();
    process.stdout.clearLine(0);
    process.stdout.clearLine(1);
    setTimeout(() => {
      this.console.term.clear();
      process.exit(0);
    }, 1300);
  }
}

interface Configs {
  [confName: string]: Configs & string,
}

interface Lang {
  [langName: string]: Lang & string
}

export default CharBot;