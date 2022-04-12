import { ChairPlugins } from "../interfaces";
import ChairWoom from "./ChairWoom";
export default class PluginManager {
    private bot;
    plugins: ChairPlugins;
    constructor(bot: ChairWoom);
    loadPlugin(name: string, options?: any): void;
    private preLoadCheck;
    unloadPlugin(name: string, options?: any): void;
    private preUnloadCheck;
    getPluginList(): Array<string>;
    toString(): string;
}
