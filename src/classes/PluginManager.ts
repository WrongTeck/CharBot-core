import { readdir } from "fs";
import ChairWoom from "./ChairWoom";
import { ChairPlugins, ChairPlugin } from "../interfaces";

export class PluginManager {
  plugins: ChairPlugins;
  constructor(private bot: ChairWoom) {
    this.plugins = {};
    this.readDir();
    return this;
  }
  /**
   * Reads the plugin folder
   */
  private readDir() {
    this.bot.console.pl(this.bot.lang.plugins.load_start);
    this.bot.emit("core.plugins.start");
    readdir("./plugins", {
      encoding: "utf-8",
      withFileTypes: true
    }, (err, files) => {
      if (err) return this.bot.console.fatal(this.bot.lang.plugins.read_dir_err);
      files.forEach((dirent) => {
        if (dirent.isDirectory()) {
          this.loadPlugin(dirent.name);
        } else {
          this.bot.emit("core.plugins.error", dirent.name);
          this.bot.console.error("Cannot load {plugin} because is not a directory!", { "plugin": dirent.name })
        }
      });
      this.bot.emit("core.plugins.finish");
    });
  }
  /**
   * Load a plugin
   * @param {String} dir The dir that contain the plugin
   * @param {String} file The file that contain the main class
   */
  public loadPlugin(dir: string) {
    let name: string, plugin: ChairPlugin;
    this.bot.emit("core.plguins.load", dir);
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
            Object.assign(loaded, {"name": plugin.name, "version": plugin.version });
          } else {
            loaded = plugin;
          }
          if(plugin.commands) {
            this.bot.console.registerCommand(plugin.commands);
          }
          Object.defineProperty(this.plugins, name, { writable: true, value: loaded });
        } else {
          this.bot.console.error(this.bot.lang.plugins.missed_module, { module: value, plugin: name });
        }
      })
    } else if(plugin.modules.length > 0) {
      this.bot.console.error(this.bot.lang.plugins.missed_module, { module: "all", plugin: name });
    } else {
      let loaded;
          if(plugin.main) {
            loaded = new plugin.main(this.bot);
            Object.assign(loaded, { "name": plugin.name, "version": plugin.version, "modules": plugin.modules, "commands": plugin.commands });
          } else {
            loaded = plugin;
          }
          if(plugin.commands) {
            this.bot.console.registerCommand(plugin.commands);
          }
          Object.defineProperty(this.plugins, name, { writable: true, value: loaded });
    }
    this.bot.emit("core.plugins.loaded", dir);
  }
  /**
   * Unloads a plugin from ChairWoom
   * @param name The name of the plugin
   * @return If the unload succeeded or not
   */
  public unloadPlugin(name: string, force: boolean): boolean {
    this.bot.emit("core.plugins.unload", name);
    if(!this.bot.plugins[name]) return false;
    if(force) {
      delete this.bot.plugins[name];
      this.bot.emit("core.plugins.unloaded", name);
      return true;
    }
    if(this.bot.plugins[name].unload)
      this.bot.plugins[name].unload();
    this.bot.emit("core.plugins.unloaded", name);
  }
  /**
   * Get the dependencies of a plugin
   * @param name The plugin name
   * @return An array of module names
   */
  public getDependecies(name: string): Array<string> {
    if(!this.bot.plugins[name] || !this.bot.plugins[name].modules) return [];
    if(this.bot.plugins[name].modules.length > 0)
      return this.bot.plugins[name].modules;
    return [];
  }
}

export default PluginManager;