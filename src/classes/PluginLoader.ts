import { readdir } from "fs";
import CharBot from "./CharBot";
import { Commands } from "./Commands";

export interface CharPlugin {
  name: string;
  version: string;
  modules?: Array<string>;
  main?: ObjectConstructor;
  commands?: Commands;
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
  readDir() {
    this.bot.console.pl(this.bot.lang.plugins.load_start);
    readdir("./plugins", {
      encoding: "utf-8",
      withFileTypes: true
    }, (err, files) => {
      if (err) return this.bot.console.fatal(this.bot.lang.plugins.read_dir_err);
      files.forEach((dirent, i, array) => {
        if (dirent.isDirectory()) {
          this.loadPlugin(dirent.name, "index.js");
        } else {
          this.loadPlugin(".", dirent.name);
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
  loadPlugin(dir: string, file: string) {
    let name: string, plugin: CharPlugin;
    if(dir == ".") {
      plugin = require(`../plugins/${file}`);
      name = file;
    } else {
      plugin = require(`../plugins/${dir}/index.js`);
      name = dir;
    }
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
            Object.assign(loaded, {"name": plugin.name, "version": plugin.version});
          } else {
            loaded = plugin;
          }
          if(plugin.commands) {
            this.bot.console.registerCommand(plugin.commands);
          }
          Object.defineProperty(this.plugins, name, {writable: true, value: loaded});
    }
  }
}

export default PluginLoader;