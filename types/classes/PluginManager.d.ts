import ChairWoom from "./ChairWoom";
import { ChairPlugins } from "../interfaces";
export declare class PluginManager {
    private bot;
    plugins: ChairPlugins;
    constructor(bot: ChairWoom);
    private readDir;
    loadPlugin(dir: string): void;
    unloadPlugin(name: string, force: boolean): boolean;
    getDependecies(name: string): Array<string>;
}
export default PluginManager;
