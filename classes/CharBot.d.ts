import { EventEmitter2 } from "eventemitter2";
import CharConsole from "./Console";
import { CharModules } from "./ModuleLoader";
import { CharPlugins } from "./PluginLoader";
export declare class CharBot extends EventEmitter2 {
    console: CharConsole;
    lang: Lang;
    config: Configs;
    plugins: CharPlugins;
    modules: CharModules;
    constructor();
    /**
     * Starts the bot
     */
    start(): CharBot;
    reloadLang(): void;
    /**
     * Stops the bot
     */
    stop(): void;
}
interface Configs {
    [confName: string]: Configs & string;
}
interface Lang {
    [langName: string]: Lang & string;
}
export default CharBot;
