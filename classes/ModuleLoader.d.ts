import CharBot from "./CharBot";
import { Commands } from "./Commands";
export interface CharModule {
    name: string;
    version: string;
    modules?: Array<string>;
    main?: any;
    commands?: Commands;
}
export interface CharModules {
    [moduleName: string]: CharModule;
}
export declare class ModuleLoader {
    modules: CharModules;
    bot: CharBot;
    constructor(bot: CharBot);
    /**
     * Read the module folder
     */
    private readDir;
    /**
     * Load a module
     * @param {String} dir The dir that contain the modules
     * @param {String} file The file that contain the main class
     */
    loadModules(dir: string, file: string): void;
    /**
     * Tries to load the dependencies of a module
     * @param name Name of the module
     * @returns If its succeeds or not
     */
    private loadDepend;
    /**
     * Unload a module and eventual dependents modules
     * @param name Name of the module to unload
     * @returns Whatever or not if the module where unloaded
     */
    unloadModule(name: string): boolean;
}
export default ModuleLoader;
