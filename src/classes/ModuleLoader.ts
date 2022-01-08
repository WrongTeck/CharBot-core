import { readdir, readdirSync } from "fs";
import CharBot from "./CharBot";
import { Commands } from "./Commands";

export interface CharModule {
  name: string;
  version: string;
  modules?: Array<string>;
  main?: any;
  commands?: Commands;
}

export interface CharModules {
  [moduleName: string]: CharModule;
}

export class ModuleLoader {
  modules: CharModules;
  bot: CharBot;
  constructor(bot: CharBot) {
    this.modules = {};
    this.bot = bot;
    this.readDir();
    return this;
  }
  /**
   * Read the module folder
   */
  private readDir() {
    this.bot.console.ml(this.bot.lang.modules.load_start);
    readdir(
      "./modules",
      {
        encoding: "utf-8",
        withFileTypes: true,
      },
      (err, files) => {
        if (err)
          return this.bot.console.fatal(this.bot.lang.modules.read_dir_err);
        files.forEach((dirent, i, array) => {
          if (dirent.isDirectory()) {
            this.loadModule(dirent.name);
          } else {
            this.bot.console.error("Cannot load {module} because is not a directory!", { "module": dirent.name });
          }
        });
        this.bot.emit("modulesLoaded");
      }
    );
  }
  /**
   * Load a module
   * @param {String} dir The dir that contain the modules
   * @param {String} file The file that contain the main class
   */
  public loadModule(dir: string) {
    let name, modulep;
    if (dir == "modules") return;
    modulep = require(`../modules/${dir}/index.js`);
    name = dir;
    this.bot.console.ml(`Loading ${name} v${modulep.version}...`);
    if (modulep.modules && modulep.modules.length > 0) {
      modulep.modules.forEach((module) => {
        if (!this.bot.modules[name]) {
          if (!this.loadDepend(module)) {
            return this.bot.console.error(`Could not load module {name}`, {
              name: name,
            });
          }
        }
      });
    }
    if (modulep.main) {
      this.bot.modules[name] = new modulep.main(this.bot);
    }
    if (modulep.commands) {
      this.bot.console.registerCommand(modulep.commands);
    }
  }
  /**
   * Tries to load the dependencies of a module
   * @param name Name of the module
   * @returns If its succeeds or not
   */
  private loadDepend(name: string): boolean {
    let modules: Array<string> = readdirSync("./modules", { encoding: "utf-8" });
    if (modules.includes(name)) {
      this.loadModule(name);
      return true;
    }
    return false;
  }
  /**
   * Unload a module and eventual dependents modules
   * @param name Name of the module to unload
   * @returns Whatever or not if the module where unloaded
   */
  public unloadModule(name: string, force: boolean): boolean {
    if(force) {
      delete this.modules[name];
      return true;
    }
    for (const charmodule in this.modules) {
      if(this.modules[charmodule].modules)
        for (const dependent in this.modules[charmodule].modules) {
          if(dependent == name)
            return false;
        }
      for (const charplugin in this.bot.plugins) {
        if(this.bot.plugins[charplugin].modules)
          for (const dependent in this.bot.plugins[charplugin].modules) {
            if(dependent == name)
              return false;
          }
      }
    }
  }
  /**
   * Return an array of the dependencies of a Modules
   * @param name Name of the module
   * @returns An array of modules name
   */
  public getDependencies(name: string): Array<string> {
    if(!this.modules[name]) return [];
    if(this.modules[name].modules && this.modules[name].modules.length > 0)
      return this.modules[name].modules;
    return [];
  }
}

export default ModuleLoader;