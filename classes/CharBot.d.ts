/// <reference types="node" />
import EventEmitter from "events";
import CharConsole from "./Console";
import { CharModules } from "./ModuleLoader";
import { CharPlugins } from "./PluginLoader";
export declare class CharBot extends EventEmitter {
    console: CharConsole;
    lang: Lang;
    config: Configs;
    plugins: CharPlugins;
    modules: CharModules;
    constructor();
    reloadLang(): void;
}
interface Configs {
    [confName: string]: Configs & string;
}
interface Lang {
    [langName: string]: Lang & string;
}
export default CharBot;
