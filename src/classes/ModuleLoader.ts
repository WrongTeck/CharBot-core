import { readdir, readdirSync } from "fs";
import CharBot from "./CharBot";
import { Commands } from "./Commands";

export interface CharModule {
  name: string;
  version: string;
  modules?: Array<string>;
  main?: ObjectConstructor;
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
  readDir() {
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
            this.loadModules(dirent.name, "index.js");
          } else {
            this.loadModules(null, dirent.name);
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
  loadModules(dir: string, file: string) {
    let name, modulep;
    if (dir == "modules" || file == "modules") return;
    if (!dir) {
      modulep = require(`../modules/${file}`);
      name = file;
    } else {
      modulep = require(`../modules/${dir}/index.js`);
      name = dir;
    }
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
  loadDepend(name: string): boolean {
    let modules: Array<string> = readdirSync("./modules", { encoding: "utf-8" });
    if (modules.includes(name)) {
      this.loadModules(name, "index.js");
      return true;
    }
    return false;
  }
}

export default ModuleLoader;