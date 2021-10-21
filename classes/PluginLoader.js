const fs = require('fs');
const CharBot = require("./CharBot");

class PluginLoader {
  /**
   * @param {CharBot} charbot The bot
   * @returns Loader class
   */
  constructor(charbot) {
    /**
     * The plugin object that contains all plugin loaded
     * @type {Object}
     */
    this.plugins = {};
    /**
     * The bot instance
     * @type {CharBot}
     */
    this.bot = charbot;
    return this.readDir();
  }
  /**
   * Read the plugin folder
   */
  readDir() {
    this.bot.console.pl(this.bot.lang.plugins.load_start);
    fs.readdir("./plugins", {
      encoding: "utf-8",
      withFileTypes: true
    }, (err, files) => {
      if (err) return this.bot.console.error(this.bot.lang.plugins.read_dir_err);
      files.forEach((dirent, i, array) => {
        if (dirent.isDirectory()) {
          this.loadPlugin(dirent.name, "index.js");
        } else {
          this.loadPlugin(".", dirent.name);
        }
      });
    });
    return this.plugins;
  }
  /**
   * Load a plugin
   * @param {String} dir The dir that contain the plugin
   * @param {String} file The file that contain the main class
   */
  loadPlugin(dir, file) {
    let name, plugin;
    if(dir == ".") {
      plugin = require(`../plugins/${file}`);
      name = file;
    } else {
      plugin = require(`../plugins/${dir}/index.js`);
      name = dir;
    }
    if(plugin.commands) {
      this.bot.console.registerCommand(plugin.commands);
    }
    if(plugin.modules) {
      plugin.modules.forEach((value, index, array) => {
        if(this.bot.modules[value].loaded) {
          Object.defineProperty(this.plugins, name, {writable: true, value: plugin});
        } else {
          this.bot.console.error(this.bot.lang.plugins.missed_module);
        }
      })
    }
  }
}

module.exports = PluginLoader;