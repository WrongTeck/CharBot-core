const fs = require('fs');
const CharBot = require("./CharBot");

class ModuleLoader {
  /**
   * @param {CharBot} charbot The bot
   * @returns Loader class
   */
  constructor(charbot) {
    /**
     * The module object that contains all modules loaded
     * @type {Object}
     */
    this.modules = {};
    /**
     * The bot instance
     * @type {CharBot}
     */
    this.bot = charbot;
    this.readDir();
    return this;
  }
  /**
   * Read the module folder
   */
  readDir() {
    this.bot.console.ml(this.bot.lang.modules.load_start);
    fs.readdir("./modules", {
      encoding: "utf-8",
      withFileTypes: true
    }, (err, files) => {
      if (err) return this.bot.console.fatal(this.bot.lang.modules.read_dir_err);
      files.forEach((dirent, i, array) => {
        if (dirent.isDirectory()) {
          this.loadModules(dirent.name, "index.js");
        } else {
          this.loadModules(false, dirent.name);
        }
      });
      this.bot.emit("modulesLoaded");
    });
  }
  /**
   * Load a module
   * @param {String} dir The dir that contain the modules
   * @param {String} file The file that contain the main class
   */
  loadModules(dir, file) {
    let name, modulep;
    if(dir == "modules" || file == "modules") return;
    if(!dir) {
      modulep = require(`../modules/${file}`);
      name = file;
    } else {
      modulep = require(`../modules/${dir}/index.js`);
      name = dir;
    }
    this.bot.console.pl(`Loading ${name} v${modulep.version}...`);
    if(modulep.modules.lenght > 0 && this.bot.modules) {
      modulep.modules.forEach((value, index, array) => {
        if(this.bot.modules[value]) {
          let loaded;
          if(modulep.main) {
            loaded = new modulep.main(this.bot);
            Object.assign(loaded, {"name": modulep.name, "version": modulep.version});
          } else {
            loaded = modulep;
          }
          if(modulep.commands) {
            this.bot.console.registerCommand(modulep.commands);
          }
          Object.defineProperty(this.modulep, name, {writable: true, value: loaded});
        } else if(modulep.modules.lenght > 0){
          this.bot.console.error(this.bot.lang.modulep.missed_module, {module: value, name: name});
        } else {
          let loaded;
          if(modulep.main) {
            loaded = new modulep.main(this.bot);
            Object.assign(loaded, {"name": modulep.name, "version": modulep.version});
          } else {
            loaded = modulep;
          }
          if(modulep.commands) {
            this.bot.console.registerCommand(modulep.commands);
          }
          Object.defineProperty(this.modulep, name, {writable: true, value: loaded});
        }
      })
    }
  }
}

module.exports = ModuleLoader;