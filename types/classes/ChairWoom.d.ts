import { EventEmitter2 } from "eventemitter2";
import { ConfigManager } from "./ConfigManager";
import ChairConsole from "./console/Console";
import PluginManager from "./PluginManager";
import RepoManager from "./repo/RepoManager";
import EventManager from "./EventManager";
import LangManager from "./LangManager";
export declare class ChairWoom extends EventEmitter2 {
    private heartbeat;
    console: ChairConsole;
    lang: LangManager;
    cm: ConfigManager;
    pm: PluginManager;
    repo: RepoManager;
    eventManager: EventManager;
    constructor();
    start(): ChairWoom;
    stop(): void;
}
export default ChairWoom;
