import EventEmitter from "events";
import { access, constants } from "fs";
import { ConfigLoader } from "./ConfigLoader";
import CharConsole from "./Console";
import ModuleLoader, { CharModules } from "./ModuleLoader";
import PluginLoader, { CharPlugins } from "./PluginLoader";




export class CharBot extends EventEmitter {
  console: CharConsole;
  lang: any;
  config: any;
  plugins: CharPlugins;
  modules: CharModules;
  constructor() {
    super({ captureRejections: true });
    this.console = new CharConsole(this);
    new ConfigLoader(this, (config) => {
      this.config = config;
      this.reloadLang();
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
  reloadLang() {
    this.lang = {};
    Object.assign(this.lang, require(__dirname + `/../languages/${this.config.core.lang}.json`));
  }
}

export default CharBot;