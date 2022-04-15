import { ChairPlugin, ChairPlugins } from "../interfaces";
import ChairWoom from "./ChairWoom";
import { readdir, mkdir, Dirent, accessSync, constants } from "fs";

export default class PluginManager {
  /**
   * Represent the plugins loaded in the manager
   */
  plugins: ChairPlugins;
  /**
   * Plugins that are awaiting to be loaded
   */
  private toLoad: Dirent[];
  /**
   * Initialize a new instance of the PluginManager
   * @param bot The ChairWoom instance calling this class
   * @returns The PluginManager
   */
  constructor(private bot: ChairWoom) {
    this.plugins = {};
    // Reads the plugins directory
    readdir(
      `./plugins`,
      { encoding: "utf-8", withFileTypes: true },
      (errDir, files) => {
        if (errDir) {
          // Tries to create directory of the plugins
          this.bot.console.log(
            "Seems that there's no plugin directory!\nCreating one..."
          );
          mkdir("./plugins", (err) => {
            if (err) {
              this.bot.console.error(
                "There was an error while trying to create the plugin directory!"
              );
              // If the directory is not accessible stops the bot
              this.bot.stop();
            } else {
              this.bot.console.log("Directory created successfully!");
            }
          });
        } else {
          // Everything fine, proceeds to parse the directory content
          this.directoryParser(files);
        }
      }
    );
    return this;
  }

  /**
   * Parse and load plugins in the correct order, if possible
   * @param files The directories to read
   */
  private directoryParser(files: Dirent[]): void {
    // Makes the dirent globals
    this.toLoad = files;
    for (let dirent of this.toLoad) {
      // Runs pre-load checks to control that everything is OK
      let result: boolean | string[] = this.preLoadCheck(dirent);
      if (!result) {
        this.bot.console.error("Could not load the plugin {name}", {
          name: dirent.name,
        });
        continue;
      }
      // Remove the element from the array
      this.toLoad.splice(this.toLoad.indexOf(dirent), 1);
      // Effectively loads the plugin in the bot
      this.loadPlugin(dirent.name);
    }
    this.bot.emit("core.plugins.finish");
  }

  /**
   * Load a plugin in the manager
   * @param name The plugin directory name
   * @param options Options to use while loading the plugin
   */
  public loadPlugin(name: string, _options?: any) {
    this.plugins[name] = {name, version: ""};
    let plugin = require(`../plugins/${name}/index.js`);
    if(plugin.main)
      this.plugins[name] = new plugin.main(this.bot);
    if(plugin.commands) {
      this.bot.console.registerCommand(plugin.commands);
    }
    Object.assign(this.plugins[name], plugin);
    
  }

  /**
   * Check that the given directory is readable
   * and that the is a valid entrypoint file in it
   * @param dirent The plugin directory name
   * @param options Options to use
   */
  private preLoadCheck(
    dirent: Dirent | string,
    _options?: any
  ): boolean | string[] {
    if (typeof dirent == "string") {
      // Builds a dummy Dirent Object
      dirent = {
        name: dirent,
        isDirectory: () => {
          return true;
        },
        isFIFO() {
          return false;
        },
        isBlockDevice() {
          return false;
        },
        isFile() {
          return !this.isDirectory();
        },
        isSocket() {
          return false;
        },
        isCharacterDevice() {
          return false;
        },
        isSymbolicLink() {
          return false;
        },
      };
    }
    // Checks that the plugin name is a Directory (Single files are no longer supported)
    if (!dirent.isDirectory()) {
      this.bot.console.error("The {name} is not a directory!", {
        name: dirent.name,
      });
      return false;
    }
    // Check the permission on the entrypoint file
    try {
      accessSync(`./plugins/${dirent.name}/index.js`, constants.R_OK);
    } catch (e) {
      // Throws an error if the check fail
      this.bot.console.error(
        "Cannot access the entrypoint of {name}\nDoes it exists?",
        { name: dirent.name }
      );
      return false;
    }
    // Pre-loads a plugin to check its dependecies
    let preload: ChairPlugin = require(`../plugins/${dirent.name}/index.js`);
    // Checks that the plugin has valid exports
    if (
      !preload.name ||
      !preload.version ||
      !(preload.main || preload.commands)
    ) {
      this.bot.console.error("The plugin {name} has not valid entries!", {
        name: dirent.name,
      });
      return false;
    }
    // Checks that the dependency field is an Object
    if (typeof preload.dependecies == "object") {
      let dependecies: boolean = this.loadDependecies(preload);
      if (!dependecies) {
        this.bot.console.error(
          "Could not load all dependecies for the plugin {name}",
          { name: dirent.name }
        );
        return false;
      }
    }
    return true;
  }

  /**
   * Unload a plugin given its name
   * @param name The plugin name
   * @param options Options to use while unloading the plugin
   */
  public unloadPlugin(name: string, options?: any) {
    if(!this.preUnloadCheck(name, options)) {
      this.bot.console.grave("Cannot unload {name}!", { name });
      return;
    }
    if(typeof this.plugins[name].unload == "function")
      try {
        this.plugins[name].unload();
      } catch (e) {
        this.bot.console.error("Error while unloading {name}!\n{e}", { name, e });
        return;
      }
    if(typeof this.bot.eventManager.registeredPluginsEvents[name] == "object")
      for(let event of this.bot.eventManager.registeredPluginsEvents[name]) {
        this.bot.eventManager.removeEventListener(name, event);
      }
    if(typeof this.plugins[name].commands == "object")
      for(let command of Object.keys(this.plugins[name].commands))
        this.bot.console.unregisterCommand(command);
    delete this.plugins[name];
    this.bot.console.pu("Unloaded {name}", { name });
  }
  /**
   * Checks that there is no depended plugin from the one
   * that is begin tried to be unloaded.
   * If yes, it's output an error if no option are passed
   * @param name The plugin name
   * @param option Options to use instead of the default one
   */
  private preUnloadCheck(name: string, options?: any): boolean {
    if(typeof options == "object")
      options = {};
    if(options.force) {
      return true;
    }
    for(let plugin of Object.keys(this.plugins)) {
      let cond = typeof this.plugins.dependecies == "object" && this.plugins[plugin].dependecies.includes(name);
      if( cond && !options.unloadDependecies)
        return false;
      else if(cond){
        this.unloadPlugin(name);
      }
    }
    return true;
  }

  /**
   * Load the dependecies of a plugin
   * @param name Plugin name
   * @returns Which dependecies where loaded
   */
  private loadDependecies(preloaded: ChairPlugin): boolean {
    // Tries to load every dependency
    for (let dependency of preloaded.dependecies) {
      // Finds the Dirent record if any
      let dirent = this.toLoad.find((dir) => {
        if(dir.name == dependency)
          return true;
      });
      // Check if it has found it in the plugins to load
      if (typeof dirent != "undefined") {
        // Remove the plugin form the ones to be loaded
        this.toLoad.splice(this.toLoad.indexOf(dirent), 1);
        let result: boolean | string[] = this.preLoadCheck(dirent);
        if (!result) {
          this.bot.console.error("Could not load the plugin {name}", {
            name: dependency,
          });
          return false;
        }
        // Loads the plugin
        this.loadPlugin(dependency);
        // Check if the plugin is already loaded
      } else if (Object.keys(this.plugins).includes(dependency)) {
        // IF already loaded skips to the next one
        continue;
      } else {
        // At this point there's no other option to return a failure status
        return false;
      }
    }
    // If this point is reached means everything fine!
    return true;
  }
  /**
   * Get the current plugins loaded in the bot
   * @returns List of the plugins
   */
  public getPluginList(): Array<string> {
    return Object.keys(this.plugins);
  }
}
