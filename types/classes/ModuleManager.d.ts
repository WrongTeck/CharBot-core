import ChairWoom from "./ChairWoom";
import { ChairModules } from "../interfaces";
export declare class ModuleManager {
    private bot;
    modules: ChairModules;
    constructor(bot: ChairWoom);
    private readDir;
    loadModule(dir: string): void;
    private loadDepend;
    unloadModule(name: string, force?: boolean): boolean;
    getDependencies(name: string): Array<string>;
}
export default ModuleManager;
