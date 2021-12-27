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
export declare class PluginLoader {
    bot: CharBot;
    plugins: CharPlugins;
    constructor(bot: CharBot);
    readDir(): void;
    /**
     * Load a plugin
     * @param {String} dir The dir that contain the plugin
     * @param {String} file The file that contain the main class
     */
    loadPlugin(dir: string, file: string): void;
}
export default PluginLoader;
