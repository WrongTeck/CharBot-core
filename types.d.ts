declare module "interfaces" {
    import { CharConsole } from "index";
    export interface Configs {
        [confName: string]: Configs & string;
    }
    export interface Lang {
        [langName: string]: Lang & string;
    }
    export interface Command {
        (console: CharConsole, args?: Array<string>): void;
    }
    export interface Commands {
        [propName: string]: Command;
    }
    export interface CharModule {
        name: string;
        version: string;
        modules?: Array<string>;
        main?: any;
        commands?: Commands;
        [name: string]: any;
    }
    export interface CharModules {
        [moduleName: string]: CharModule;
    }
    export interface PlaceHolder {
        [propName: string]: any;
    }
    export interface CharPlugin {
        name: string;
        version: string;
        modules?: Array<string>;
        main?: any;
        commands?: Commands;
        [property: string]: any;
    }
    export interface CharPlugins {
        [pluginName: string]: CharPlugin;
    }
}
declare module "classes/ConfigManager" {
    import CharBot from "classes/CharBot";
    export class ConfigManager {
        config: Object;
        bot: CharBot;
        constructor(bot: CharBot, callback: Function);
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
    import { CharBot } from "index";
    export class Logger extends PlaceHolders {
        filename: string;
        commands: Commands;
        executor: Function;
        history: Array<string>;
        last: boolean;
        lastCons: any;
        bot: CharBot;
        constructor(bot: CharBot);
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
    import CharConsole from "classes/Console";
    export let BasicCommands: {
        stop(console: CharConsole): void;
        exit(console: CharConsole): void;
        clearLogs(console: CharConsole): void;
        history(console: CharConsole): void;
        commands(console: any): void;
        help(console: CharConsole): void;
        reloadLang(console: CharConsole): void;
        clear(console: CharConsole): void;
        reloadCommands(console: CharConsole): void;
    };
    export default BasicCommands;
}
declare module "classes/Console" {
    import { Logger } from "classes/Logger";
    import CharBot from "classes/CharBot";
    import { Commands } from "interfaces";
    export class CharConsole extends Logger {
        lastCommand: string;
        bot: CharBot;
        term: any;
        commands: Commands;
        constructor(charbot: CharBot);
        private key;
        command(last: string): void;
        enter(): void;
        unregisterCommand(name?: string): void;
        registerCommand(commands: Commands): void;
    }
    export default CharConsole;
}
declare module "classes/ModuleManager" {
    import CharBot from "classes/CharBot";
    import { CharModules } from "interfaces";
    export class ModuleManager {
        modules: CharModules;
        bot: CharBot;
        constructor(bot: CharBot);
        private readDir;
        loadModule(dir: string): void;
        private loadDepend;
        unloadModule(name: string, force: boolean): boolean;
        getDependencies(name: string): Array<string>;
    }
    export default ModuleManager;
}
declare module "classes/PluginManager" {
    import CharBot from "classes/CharBot";
    import { CharPlugins } from "interfaces";
    export class PluginManager {
        bot: CharBot;
        plugins: CharPlugins;
        constructor(bot: CharBot);
        private readDir;
        loadPlugin(dir: string): void;
        unloadPlugin(name: string, force: boolean): boolean;
        getDependecies(name: string): Array<string>;
    }
    export default PluginManager;
}
declare module "classes/CharBot" {
    import { EventEmitter2 } from "eventemitter2";
    import CharConsole from "classes/Console";
    import { Configs, Lang, CharModules, CharPlugins } from "interfaces";
    export class CharBot extends EventEmitter2 {
        console: CharConsole;
        lang: Lang;
        config: Configs;
        plugins: CharPlugins;
        modules: CharModules;
        constructor();
        start(): CharBot;
        reloadLang(): void;
        stop(): void;
    }
    export default CharBot;
}
declare module "index" {
    import CharBot from "classes/CharBot";
    import CharConsole from "classes/Console";
    import Logger from "classes/Logger";
    import PlaceHolders from "classes/PlaceHolders";
    import ModuleLoader from "classes/ModuleManager";
    import PluginLoader from "classes/PluginManager";
    import { BasicCommands } from "classes/Commands";
    import { Command, Commands } from "interfaces";
    export { CharBot, CharConsole, PlaceHolders, Logger, PluginLoader, ModuleLoader, Command, Commands, BasicCommands, };
}
