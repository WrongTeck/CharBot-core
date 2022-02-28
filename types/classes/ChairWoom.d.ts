import { EventEmitter2 } from "eventemitter2";
import ChairConsole from "./Console";
import { Configs, Lang, ChairModules, ChairPlugins } from "../interfaces";
export declare class ChairWoom extends EventEmitter2 {
    console: ChairConsole;
    lang: Lang;
    config: Configs;
    plugins: ChairPlugins;
    modules: ChairModules;
    /**
     * Initialize a new ChairWoom instance
     * @returns The ChairWoom instance
     */
    constructor();
    /**
     * Starts the bot
     */
    start(): ChairWoom;
    /**
     * Reload all languages files
     */
    reloadLang(): void;
    /**
     * Stops the bot
     */
    stop(): void;
}
export default ChairWoom;
