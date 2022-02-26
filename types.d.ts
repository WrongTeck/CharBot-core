declare module "interfaces" {
    import { ChairConsole } from "index";
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
    export interface ChairModule {
        name: string;
        version: string;
        modules?: Array<string>;
        main?: any;
        commands?: Commands;
        [name: string]: any;
    }
    export interface ChairModules {
        [moduleName: string]: ChairModule;
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
        [property: string]: any;
    }
    export interface ChairPlugins {
        [pluginName: string]: ChairPlugin;
    }
}
declare module "classes/ConfigManager" {
    import ChairBot from "classes/ChairWoom";
    export class ConfigManager {
        config: Object;
        bot: ChairBot;
        constructor(bot: ChairBot, callback: Function);
        loadConfig(): Promise<unknown>;
        reloadConfig(): void;
        unloadConfig(name: string): void;
    }
}
declare module "classes/PlaceHolders" {
    import Logger from "classes/Logger";
    import { PlaceHolder } from "interfaces";
    export class PlaceHolders {
        logger: Logger;
        constructor();
        parse(data: string, placeHolders: PlaceHolder): string;
    }
    export default PlaceHolders;
}
declare module "classes/Logger" {
    import PlaceHolders from "classes/PlaceHolders";
    import { Commands, PlaceHolder } from "interfaces";
    import { ChairWoom } from "index";
    export class Logger extends PlaceHolders {
        filename: string;
        commands: Commands;
        executor: Function;
        history: Array<string>;
        last: boolean;
        lastCons: any;
        bot: ChairWoom;
        constructor(bot: ChairWoom);
        addHistory(command: string): void;
        private file;
        private cons;
        private prelog;
        log(message: string, placeholders?: PlaceHolder): void;
        warn(message: string, placeholders?: PlaceHolder): void;
        error(message: string, placeholders?: PlaceHolder): void;
        grave(message: string, placeholders?: PlaceHolder): void;
        ml(message: string, placeholders?: PlaceHolder): void;
        pl(message: string, placeholders?: PlaceHolder): void;
        mu(message: string, placeholders?: PlaceHolder): void;
        pu(message: string, placeholders?: PlaceHolder): void;
        fatal(message: string, placeholders?: PlaceHolder): void;
        debug(message: string, placeholders?: PlaceHolder): void;
        rearm(): void;
    }
    export default Logger;
}
declare module "classes/Commands" {
    import ChairConsole from "classes/Console";
    export let BasicCommands: {
        stop(console: ChairConsole): void;
        exit(console: ChairConsole): void;
        clearLogs(console: ChairConsole): void;
        history(console: ChairConsole): void;
        commands(console: any): void;
        help(console: ChairConsole): void;
        reloadLang(console: ChairConsole): void;
        clear(console: ChairConsole): void;
        reloadCommands(console: ChairConsole): void;
    };
    export default BasicCommands;
}
declare module "classes/Console" {
    import { Logger } from "classes/Logger";
    import ChairBot from "classes/ChairWoom";
    import { Commands } from "interfaces";
    export class ChairConsole extends Logger {
        lastCommand: string;
        bot: ChairBot;
        term: any;
        commands: Commands;
        constructor(Chairbot: ChairBot);
        private key;
        command(last: string): void;
        enter(): void;
        unregisterCommand(name?: string): void;
        registerCommand(commands: Commands): void;
    }
    export default ChairConsole;
}
declare module "classes/ModuleManager" {
    import ChairBot from "classes/ChairWoom";
    import { ChairModules } from "interfaces";
    export class ModuleManager {
        modules: ChairModules;
        bot: ChairBot;
        constructor(bot: ChairBot);
        private readDir;
        loadModule(dir: string): void;
        private loadDepend;
        unloadModule(name: string, force: boolean): boolean;
        getDependencies(name: string): Array<string>;
    }
    export default ModuleManager;
}
declare module "classes/PluginManager" {
    import ChairBot from "classes/ChairWoom";
    import { ChairPlugins } from "interfaces";
    export class PluginManager {
        bot: ChairBot;
        plugins: ChairPlugins;
        constructor(bot: ChairBot);
        private readDir;
        loadPlugin(dir: string): void;
        unloadPlugin(name: string, force: boolean): boolean;
        getDependecies(name: string): Array<string>;
    }
    export default PluginManager;
}
declare module "classes/ChairWoom" {
    import { EventEmitter2 } from "eventemitter2";
    import ChairConsole from "classes/Console";
    import { Configs, Lang, ChairModules, ChairPlugins } from "interfaces";
    export class ChairWoom extends EventEmitter2 {
        console: ChairConsole;
        lang: Lang;
        config: Configs;
        plugins: ChairPlugins;
        modules: ChairModules;
        constructor();
        start(): ChairWoom;
        reloadLang(): void;
        stop(): void;
    }
    export default ChairWoom;
}
declare module "index" {
    import ChairWoom from "classes/ChairWoom";
    import ChairConsole from "classes/Console";
    import Logger from "classes/Logger";
    import PlaceHolders from "classes/PlaceHolders";
    import ModuleLoader from "classes/ModuleManager";
    import PluginLoader from "classes/PluginManager";
    import { BasicCommands } from "classes/Commands";
    import { Command, Commands } from "interfaces";
    export { ChairWoom, ChairConsole, PlaceHolders, Logger, PluginLoader, ModuleLoader, Command, Commands, BasicCommands, };
}
