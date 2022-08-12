/// <reference types="node" />
import { ChairPlugins } from "../interfaces";
import ChairWoom from "./ChairWoom";
import { Dirent } from "fs";
export default class PluginManager {
    private bot;
    plugins: ChairPlugins;
    private toLoad;
    constructor(bot: ChairWoom);
    private directoryParser;
    loadPlugin(pluginDir: Dirent, _options?: any): boolean;
    private preLoadCheck;
    unloadPlugin(name: string, options?: any): void;
    private preUnloadCheck;
    private loadDependecies;
    getPluginList(): Array<string>;
}
