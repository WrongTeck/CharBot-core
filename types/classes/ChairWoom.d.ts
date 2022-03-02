import { EventEmitter2 } from "eventemitter2";
import ChairConsole from "./Console";
import ModuleManager from "./ModuleManager";
import PluginManager from "./PluginManager";
import { Configs, Lang } from "../interfaces";
import RepoManager from "./RepoManager";
import EventManager from "./EventManager";
export declare class ChairWoom extends EventEmitter2 {
    console: ChairConsole;
    lang: Lang;
    config: Configs;
    plugins: PluginManager;
    modules: ModuleManager;
    repo: RepoManager;
    eventManager: EventManager;
    constructor();
    start(): ChairWoom;
    reloadLang(): void;
    stop(): void;
}
export default ChairWoom;
