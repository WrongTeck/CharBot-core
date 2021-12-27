import CharBot from "./CharBot";
import { Commands } from "./Commands";
export interface CharModule {
    name: string;
    version: string;
    modules?: Array<string>;
    main?: ObjectConstructor;
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
    readDir(): void;
    /**
     * Load a module
     * @param {String} dir The dir that contain the modules
     * @param {String} file The file that contain the main class
     */
    loadModules(dir: string, file: string): void;
    loadDepend(name: string): boolean;
}
export default ModuleLoader;
