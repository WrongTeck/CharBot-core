declare module "classes/ConfigLoader" {
    import CharBot from "classes/CharBot";
    export class ConfigLoader {
        config: Object;
        bot: CharBot;
        constructor(bot: CharBot, callback: Function);
        loadConfig(): Promise<unknown>;
        reloadConfig(): void;
        unloadConfig(name: any): void;
    }
}
declare module "classes/PlaceHolders" {
    import Logger from "classes/Logger";
    export interface PlaceHolder {
        [propName: string]: any;
    }
    export class PlaceHolders {
        logger: Logger;
        constructor();
        parse(data: string, placeHolders: PlaceHolder): string;
    }
    export default PlaceHolders;
}
declare module "classes/Commands" {
    import CharConsole from "classes/Console";
    export interface Command {
        (console: CharConsole, args?: Array<string>): null;
    }
    export interface Commands {
        [propName: string]: Command;
    }
    export let BasicCommands: {
        stop(console: CharConsole): void;
        exit(console: CharConsole): void;
        clearLogs(console: CharConsole): void;
        /**
         * Show all commands typed
         */
        history(console: CharConsole): void;
        /**
         * Show what commands are registered in the bot
         */
        commands(console: any): void;
        /**
         * Print a quick help
         */
        help(console: CharConsole): void;
        /**
         * Reload console commands
         */
        reloadLang(console: CharConsole): void;
        /**
         * Clear the stdout
         */
        clear(console: CharConsole): void;
        reloadCommands(console: CharConsole): void;
    };
    export default BasicCommands;
}
declare module "classes/Logger" {
    import { PlaceHolder, PlaceHolders } from "classes/PlaceHolders";
    import { Commands } from "classes/Commands";
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
        file(message: string, type: string): void;
        cons(): void;
        prelog(type: string, message: string): string[];
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
    }
    export default Logger;
}
declare module "classes/Console" {
    import { Logger } from "classes/Logger";
    import CharBot from "classes/CharBot";
    import { Commands } from "classes/Commands";
    export class CharConsole extends Logger {
        lastCommand: string;
        bot: CharBot;
        term: any;
        commands: Commands;
        constructor(charbot: CharBot);
        character(name: string): void;
        command(last: string): void;
        enter(): void;
        unregisterCommand(name?: string): void;
        registerCommand(commands: Commands): void;
    }
    export default CharConsole;
}
declare module "classes/ModuleLoader" {
    import CharBot from "classes/CharBot";
    import { Commands } from "classes/Commands";
    export interface CharModule {
        name: string;
        version: string;
        modules?: Array<string>;
        main?: any;
        commands?: Commands;
    }
    export interface CharModules {
        [moduleName: string]: CharModule;
    }
    export class ModuleLoader {
        modules: CharModules;
        bot: CharBot;
        constructor(bot: CharBot);
        /**
         * Read the module folder
         */
        private readDir;
        /**
         * Load a module
         * @param {String} dir The dir that contain the modules
         * @param {String} file The file that contain the main class
         */
        loadModule(dir: string): void;
        /**
         * Tries to load the dependencies of a module
         * @param name Name of the module
         * @returns If its succeeds or not
         */
        private loadDepend;
        /**
         * Unload a module and eventual dependents modules
         * @param name Name of the module to unload
         * @returns Whatever or not if the module where unloaded
         */
        unloadModule(name: string, force: boolean): boolean;
        /**
         * Return an array of the dependencies of a Modules
         * @param name Name of the module
         * @returns An array of modules name
         */
        getDependencies(name: string): Array<string>;
    }
    export default ModuleLoader;
}
declare module "classes/PluginLoader" {
    import CharBot from "classes/CharBot";
    import { Commands } from "classes/Commands";
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
    export interface _PluginManager {
        bot: CharBot;
        [pluginName: string]: CharPlugin | any;
    }
    export class PluginLoader implements _PluginManager {
        bot: CharBot;
        plugins: CharPlugins;
        constructor(bot: CharBot);
        private readDir;
        /**
         * Load a plugin
         * @param {String} dir The dir that contain the plugin
         * @param {String} file The file that contain the main class
         */
        loadPlugin(dir: string): void;
        /**
         * Unloads a plugin from CharBot
         * @param name The name of the plugin
         * @return If the unload succeeded or not
         */
        unloadPlugin(name: string, force: boolean): boolean;
        /**
         * Get the dependencies of a plugin
         * @param name The plugin name
         * @return An array of module names
         */
        getDependecies(name: string): Array<string>;
    }
    export default PluginLoader;
}
declare module "classes/CharBot" {
    import { EventEmitter2 } from "eventemitter2";
    import CharConsole from "classes/Console";
    import { CharModules } from "classes/ModuleLoader";
    import { CharPlugins } from "classes/PluginLoader";
    export class CharBot extends EventEmitter2 {
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
        /**
         * Reload all languages files
         */
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
}
declare module "index" {
    import CharBot from "classes/CharBot";
    import CharConsole from "classes/Console";
    import Logger from "classes/Logger";
    import PlaceHolders from "classes/PlaceHolders";
    import ModuleLoader from "classes/ModuleLoader";
    import PluginLoader from "classes/PluginLoader";
    import { Command, Commands, BasicCommands } from "classes/Commands";
    export { CharBot, CharConsole, PlaceHolders, Logger, PluginLoader, ModuleLoader, Command, Commands, BasicCommands, };
}
