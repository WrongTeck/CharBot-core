/// <reference types="node" />
import { ChairConsole } from "./classes/console/Console";
export interface Configs {
    [confName: string]: Configs & string;
}
export interface Lang {
    [langName: string]: Lang & string;
}
export interface Command {
    (console: ChairConsole, args?: Array<string>): void;
}
export interface Commands {
    [propName: string]: Command;
}
export interface PlaceHolder {
    [propName: string]: any;
}
export interface ChairPlugin {
    name: string;
    version: string;
    modules?: Array<string>;
    main?: any;
    commands?: Commands;
    dependecies?: string[];
    [property: string]: any;
}
export interface ChairPlugins {
    [pluginName: string]: ChairPlugin;
}
export interface HashUpdate {
    core: string;
    plugins: string;
}
export interface ChairWoomEvents {
    "core.heartbeat": [cycle: number];
    "core.start": [void];
    "core.logger.info": [message: string];
    "core.logger.warn": [message: string];
    "core.logger.error": [message: string];
    "core.logger.grave": [message: string];
    "core.logger.ml": [message: string];
    "core.logger.pl": [message: string];
    "core.logger.mu": [message: string];
    "core.logger.pu": [message: string];
    "core.logger.fatal": [message: string];
    "core.logger.debug": [message: string];
    "core.console.unregister": [name: string];
    "core.console.register": [name: string];
    "core.config.start": [void];
    "core.config.err": [error: NodeJS.ErrnoException];
    "core.config.finish": [void];
    "core.config.reload": [void];
    "core.config.reloaded": [void];
    "core.config.unload": [name: string];
    "core.config.unloaded": [name: string];
    "core.lang.unload": [name: string];
    "core.lang.code": [codeName: string];
    "core.lang.load": [name: string];
    "core.plugins.finish": [void];
    "core.plugins.errorLoading": [name: string, error: string];
    "core.finish": [void];
    "core.shutdown": [void];
}
declare module "./classes/ChairWoom" {
    interface ChairWoom {
        on<K extends keyof ChairWoomEvents>(event: K, listener: (...args: ChairWoomEvents[K]) => void): this;
    }
}
