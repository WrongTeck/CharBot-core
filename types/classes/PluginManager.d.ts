import ChairWoom from "./ChairWoom";
import { ChairPlugins } from "../interfaces";
export declare class PluginManager {
    bot: ChairWoom;
    plugins: ChairPlugins;
    constructor(bot: ChairWoom);
    /**
     * Reads the plugin folder
     */
    private readDir;
    /**
     * Load a plugin
     * @param {String} dir The dir that contain the plugin
     * @param {String} file The file that contain the main class
     */
    loadPlugin(dir: string): void;
    /**
     * Unloads a plugin from ChairWoom
     * @param name The name of the plugin
     * @return If the unload succeeded or not
     */
    unloadPlugin(name: string, force: boolean): boolean;
    /**
     * Get the dependencies of a plugin
     * @param name The plugin name
     * @return An array of module names
     */
    getDependecies(name: string): Array<string>;
}
export default PluginManager;
