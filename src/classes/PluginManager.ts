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
    readdir(
      `./plugins`,
      { encoding: "utf-8", withFileTypes: true },
      (errDir, files) => {
        if (errDir) {
          this.bot.console.log(
            "Seems that there's no plugin directory!\nCreating one..."
          );
          mkdir("./plugins", (err) => {
            if (err) {
              this.bot.console.error(
                "There was an error while trying to create the plugin directory!"
              );
              this.bot.stop();
            } else {
              this.bot.console.log("Directory created successfully!");
            }
          });
        } else {
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
    this.toLoad = files;
    for (let dirent of files) {
      let result: boolean | string[] = this.preLoadCheck(dirent);
      if (!result) {
        this.bot.console.error("Could not load the plugin {name}", {
          name: dirent.name,
        });
        continue;
      }
      this.loadPlugin(dirent.name);
    }
  }

  /**
   * Load a plugin in the manager
   * @param name The plugin directory name
   * @param options Options to use while loading the plugin
   */
  public loadPlugin(name: string, options?: any) {
    // Working on it
  }

  /**
   * Check that the given directory is readable
   * and that the is a valid entrypoint file in it
   * @param name The plugin directory name
   * @param options Options to use
   */
  private preLoadCheck(dirent: Dirent, options?: any): boolean | string[] {
    if (!dirent.isDirectory()) {
      this.bot.console.error("The {name} is not a directory!", {
        name: dirent.name,
      });
      return false;
    }
    try {
      accessSync(`./plugins/${dirent.name}/index.js`, constants.R_OK);
    } catch (e) {
      this.bot.console.error(
        "Cannot access the entrypoint of {name}\nDoes it exists?",
        { name: dirent.name }
      );
      return false;
    }
    let preload: ChairPlugin = require(`./plugins/${dirent.name}/index.js`);
    if (
      !preload.name ||
      !preload.version ||
      !(preload.main || preload.commands)
    )
      return false;
    if (typeof preload.dependecies == "object") {
      let dependecies: string[] | false = this.loadDependecies(preload);
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
    // Working on it
  }
  /**
   * Checks that there is no depended plugin from the one
   * that is begin tried to be unloaded.
   * If yes, it's output an error if no option are passed
   * @param name The plugin name
   * @param option Options to use instead of the default one
   */
  private preUnloadCheck(name: string, options?: any) {
    // Working on it
  }

  /**
   * Load the dependecies of a plugin
   * @param name Plugin name
   * @returns Which dependecies where loaded
   */
  private loadDependecies(preloaded: ChairPlugin): string[] | false {
    let loaded: string[] = [];
    for (let dependency of preloaded.dependecies) {
    }
    return false;
  }
  /**
   * Get the current plugins loaded in the bot
   * @returns List of the plugins
   */
  public getPluginList(): Array<string> {
    return Object.keys(this.plugins);
  }
}
