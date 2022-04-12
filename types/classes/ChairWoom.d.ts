import { EventEmitter2 } from "eventemitter2";
import ChairConsole from "./Console";
import PluginManager from "./PluginManager";
import { Configs } from "../interfaces";
import RepoManager from "./RepoManager";
import EventManager from "./EventManager";
import LangManager from "./LangManager";
export declare class ChairWoom extends EventEmitter2 {
    console: ChairConsole;
    lang: LangManager;
    config: Configs;
    plugins: PluginManager;
    repo: RepoManager;
    eventManager: EventManager;
    constructor();
    start(): ChairWoom;
    stop(): void;
}
export default ChairWoom;
