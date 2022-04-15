import { ChairPlugins } from "../interfaces";
import ChairWoom from "./ChairWoom";
export default class PluginManager {
    private bot;
    plugins: ChairPlugins;
    private toLoad;
    constructor(bot: ChairWoom);
    private directoryParser;
    loadPlugin(name: string, _options?: any): void;
    private preLoadCheck;
    unloadPlugin(name: string, options?: any): void;
    private preUnloadCheck;
    private loadDependecies;
    getPluginList(): Array<string>;
}
