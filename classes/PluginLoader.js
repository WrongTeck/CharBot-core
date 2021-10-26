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
    this.readDir();
    return this;
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
  loadPlugin(dir, file) {
    let name, plugin;
    if(dir == ".") {
      plugin = require(`../plugins/${file}`);
      name = file;
    } else {
      plugin = require(`../plugins/${dir}/index.js`);
      name = dir;
    }
    this.bot.console.pl(`Loading ${name} v${plugin.version}...`);
    if(plugin.modules && this.bot.modules) {
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
    } else {
      this.bot.console.error(this.bot.lang.plugins.missed_module, {module: "all", plugin: name});
    }
  }
}

module.exports = PluginLoader;