import { ChairPlugins } from "../interfaces";
import ChairWoom from "./ChairWoom";
import { readdir, mkdir } from "fs";

export default class PluginManager {
  /**
   * Represent the plugins loaded in the manager
   */
  plugins: ChairPlugins;
  /**
   * Initialize a new instance of the PluginManager
   * @param bot The ChairWoom instance calling this class
   * @returns The PluginManager
   */
  constructor(private bot: ChairWoom) {
    this.plugins = {};
    readdir(`./plugins`, { encoding: "utf-8", withFileTypes: true }, (errDir) => {
      if(errDir) {
        this.bot.console.log("Seems that there's no plugin directory!\nCreating one...");
        mkdir("./plugins", (err) => {
          if(err) {
            this.bot.console.error("There was an error while trying to create the plugin directory!");
            this.bot.stop();
          } else {
            this.bot.console.log("Directory created successfully!");
          }
        });
      }
    });
    return this;
  }

  /**
   * Load a plugin in the manager
   * @param name The plugin directory name
   * @param options Options to use while loading the plugin
   */
  public loadPlugin(name: string, options?: any) {

  }

  /**
   * Check that the given directory is readable
   * and that the is a valid entrypoint file in it
   * @param name The plugin directory name
   * @param options Options to use
   */
  private preLoadCheck(name: string, options?: any) {

  }

  /**
   * Unload a plugin given its name
   * @param name The plugin name
   * @param options Options to use while unloading the plugin
   */
  public unloadPlugin(name: string, options?: any) {

  }
  /**
   * Checks that there is no depended plugin from the one
   * that is begin tried to be unloaded.
   * If yes, it's output an error if no option are passed
   * @param name The plugin name
   * @param option Options to use instead of the default one
   */
  private preUnloadCheck(name: string, options?: any) {

  }
  
  public getPluginList(): Array<string> {
    return Object.keys(this.plugins);
  }

  public toString(): string {
    return new String(this).toString();
  }
}