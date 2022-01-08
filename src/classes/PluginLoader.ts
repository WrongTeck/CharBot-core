import { readdir } from "fs";
import CharBot from "./CharBot";
import { Commands } from "./Commands";

export interface CharPlugin {
  name: string;
  version: string;
  modules?: Array<string>;
  main?: any;
  commands?: Commands;
  [property: string]: any;
}

export interface CharPlugins {
  [pluginName: string]: CharPlugin;
}

export class PluginLoader {
  bot: CharBot;
  plugins: CharPlugins;
  constructor(bot: CharBot) {
    this.bot = bot;
    this.plugins = {};
    this.readDir();
    return this;
  }
  private readDir() {
    this.bot.console.pl(this.bot.lang.plugins.load_start);
    readdir("./plugins", {
      encoding: "utf-8",
      withFileTypes: true
    }, (err, files) => {
      if (err) return this.bot.console.fatal(this.bot.lang.plugins.read_dir_err);
      files.forEach((dirent, i, array) => {
        if (dirent.isDirectory()) {
          this.loadPlugin(dirent.name);
        } else {
          this.bot.console.error("Cannot load {plugin} because is not a directory!", { "plugin": dirent.name })
        }
      });
      this.bot.emit("pluginsLoaded");
    });
  }
  /**
   * Load a plugin
   * @param {String} dir The dir that contain the plugin
   * @param {String} file The file that contain the main class
   */
  public loadPlugin(dir: string) {
    let name: string, plugin: CharPlugin;
    if(dir == "plugins") return;
    plugin = require(`../plugins/${dir}/index.js`);
    name = dir;
    this.bot.console.pl(`Loading ${name} v${plugin.version}...`);
    if(plugin.modules.length > 0 && this.bot.modules) {
      plugin.modules.forEach((value, index, array) => {
        if(this.bot.modules[value]) {
          let loaded;
          if(plugin.main) {
            loaded = new plugin.main(this.bot);
            Object.assign(loaded, {"name": plugin.name, "version": plugin.version});
          } else {
            loaded = plugin;
          }
          if(plugin.commands) {
            this.bot.console.registerCommand(plugin.commands);
          }
          Object.defineProperty(this.plugins, name, {writable: true, value: loaded});
        } else {
          this.bot.console.error(this.bot.lang.plugins.missed_module, {module: value, plugin: name});
        }
      })
    } else if(plugin.modules.length > 0) {
      this.bot.console.error(this.bot.lang.plugins.missed_module, {module: "all", plugin: name});
    } else {
      let loaded;
          if(plugin.main) {
            loaded = new plugin.main(this.bot);
            Object.assign(loaded, {"name": plugin.name, "version": plugin.version, "modules": plugin.modules, "commands": plugin.commands});
          } else {
            loaded = plugin;
          }
          if(plugin.commands) {
            this.bot.console.registerCommand(plugin.commands);
          }
          Object.defineProperty(this.plugins, name, {writable: true, value: loaded});
    }
  }
  /**
   * Unloads a plugin from CharBot
   * @param name The name of the plugin
   * @return If the unload succeeded or not
   */
  public unloadPlugin(name: string, force: boolean): boolean {
    if(force && this.bot.plugins[name]) {
      if(this.plugins[name].unload)
        this.plugins[name].unload();
      delete this.bot.plugins[name];
      return true
    }
    if(!this.bot.plugins[name]) return false;
    //Incomplete, needs normal procedure
  }
}

export default PluginLoader;