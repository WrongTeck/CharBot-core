import ChairWoom from "./ChairWoom";
import { ChairModules } from "../interfaces";
export declare class ModuleManager {
    modules: ChairModules;
    bot: ChairWoom;
    /**
     * Initialize a new instance of the ModuleManager
     * @param bot The instance of ChairWoom
     * @returns The ModuleManager
     */
    constructor(bot: ChairWoom);
    /**
     * Read the module folder
     */
    private readDir;
    /**
     * Load a module
     * @param dir The dir that contain the modules
     * @param file The file that contain the main class
     */
    loadModule(dir: string): void;
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
    unloadModule(name: string, force: boolean): boolean;
    /**
     * Return an array of the dependencies of a Modules
     * @param name Name of the module
     * @returns An array of modules name
     */
    getDependencies(name: string): Array<string>;
}
export default ModuleManager;
