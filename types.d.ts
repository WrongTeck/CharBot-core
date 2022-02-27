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
    import ChairWoom from "classes/ChairWoom";
    export class ConfigManager {
        config: Object;
        bot: ChairWoom;
        /**
         * Initialize a new instance of the ConfigManager
         * @param bot The ChairBot instance that called it
         * @param callback Returns when the configs are ready
         * @returns The ConfigManager
         */
        constructor(bot: ChairWoom, callback: Function);
        /**
         * Load all configs from the config folder
         * @returns A promise with the config
         */
        loadConfig(): Promise<unknown>;
        /**
         * Reloads configs in the bot
         */
        reloadConfig(): void;
        /**
         * Unloads a specific config from the bot
         * @param name The config name
         */
        unloadConfig(name: string): void;
    }
}
declare module "classes/PlaceHolders" {
    import Logger from "classes/Logger";
    import { PlaceHolder } from "interfaces";
    export class PlaceHolders {
        logger: Logger;
        /**
         * Initialize a new PlaceHolder parser instance
         * @returns The PlaceHolder parser
         */
        constructor();
        /**
         * Replace placeholders with their values, based on the passed PlaceHolder object
         * @param data The unformatted string
         * @param placeHolders The placeholder object to parse
         * @returns The formatted string
         */
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
        /**
         * @param bot The ChairBot instance that called the logger
         * @returns A new Logger instance
         */
        constructor(bot: ChairWoom);
        /**
         * Append a command to the history of the typed commands
         * @param command The command to append
         */
        addHistory(command: string): void;
        /**
         * Append a message with its logging level to the log file
         * @param message The message to log
         * @param type The logging level
         */
        private file;
        /**
         * Create a prompt for input
         */
        private cons;
        /**
         * Does all the pre-logging stuff
         * Write to the file and calculate the time
         * @param type The logging level
         * @param message The message to log
         * @returns Whatever or not to print a \n and the time
         */
        private prelog;
        /**
         * Print a formatted message to the console with LOG level
         * @param message The message to log
         * @param placeholders An object with PlaceHolder data
         */
        log(message: string, placeholders?: PlaceHolder): void;
        /**
         * Print a formatted message to console with WARN level
         * @param message The message to print
         * @param placeholders A PlaceHolder object
         */
        warn(message: string, placeholders?: PlaceHolder): void;
        /**
         * Prints a formatted message to the console with ERROR level
         * @param message The message to print
         * @param placeholders A PlaceHolder object
         */
        error(message: string, placeholders?: PlaceHolder): void;
        /**
         * Print a message to the console with GRAVE level
         * @param message The message to print
         * @param placeholders A PlaceHolder object
         */
        grave(message: string, placeholders?: PlaceHolder): void;
        /**
         * Prints a message to console with Module Loader level
         * Should be used **ONLY** by the ModuleManager
         * @param message The message to print
         * @param placeholders PlaceHolder data
         */
        ml(message: string, placeholders?: PlaceHolder): void;
        /**
         * Prints a formatted message to the console with Plugin Loader level
         * Should be used **ONLY** by the PluginManager
         * @param message The message to print
         * @param placeholders PlaceHolder data
         */
        pl(message: string, placeholders?: PlaceHolder): void;
        /**
         * Print a formatted message to the console with Module Unload level
         * Should be used **ONLY** by the ModuleManager
         * @param message The message to print
         * @param placeholders PlaceHolder data
         */
        mu(message: string, placeholders?: PlaceHolder): void;
        /**
         * Prints a message to the console with Plugin Unload level
         * Should be used **ONLY** by the PluginManager
         * @param message The message to print
         * @param placeholders PlaceHolder data
         */
        pu(message: string, placeholders?: PlaceHolder): void;
        /**
         * Prints a message to the console with FATAL level
         * **WARN**: This also will trigger the shutdown of the bot!
         * @param message The message to print
         * @param placeholders PlaceHolder data
         */
        fatal(message: string, placeholders?: PlaceHolder): void;
        /**
         * If debug mode is enabled, prints a formatted message to the console with DEBUG level
         * @param message The message to print
         * @param placeholders PlaceHolder data
         */
        debug(message: string, placeholders?: PlaceHolder): void;
        /**
         * Reload the prompt
         */
        rearm(): void;
    }
    export default Logger;
}
declare module "classes/Commands" {
    import ChairConsole from "classes/Console";
    export let BasicCommands: {
        /**
         * Strops the bot from the console
         * @param console The console
         */
        stop(console: ChairConsole): void;
        /**
         * Alias for stop
         * @param console The console
         */
        exit(console: ChairConsole): void;
        /**
         * Clear the logs folder
         * @param console The console
         */
        clearLogs(console: ChairConsole): void;
        /**
         * Show all commands typed
         */
        history(console: ChairConsole): void;
        /**
         * Show what commands are registered in the bot
         */
        commands(console: any): void;
        /**
         * Print a quick help
         */
        help(console: ChairConsole): void;
        /**
         * Reload console commands
         */
        reloadLang(console: ChairConsole): void;
        /**
         * Clear the stdout
         */
        clear(console: ChairConsole): void;
        /**
         * Reload all commands in ChairBot
         * @param console The console
         */
        reloadCommands(console: ChairConsole): void;
    };
    export default BasicCommands;
}
declare module "classes/Console" {
    import { Logger } from "classes/Logger";
    import ChairWoom from "classes/ChairWoom";
    import { Commands } from "interfaces";
    export class ChairConsole extends Logger {
        lastCommand: string;
        bot: ChairWoom;
        term: any;
        commands: Commands;
        /**
         * Initialize a new instance of the ChairConsole
         * @param Chairbot The instance that called the Console
         */
        constructor(Chairbot: ChairWoom);
        /**
         * Handle a key/combination of keys
         * @param name The key name
         */
        private key;
        /**
         * Handles commands inside ChairWoom
         * @param last The last command typed
         * @returns An error if any
         */
        command(last: string): void;
        /**
         * Create an input field for the ChairWoom console
         */
        enter(): void;
        /**
         * Unregister a command from the Console
         * If no arguments is passed all commands will be unload
         * except of the basic ones
         * @param name Command name
         */
        unregisterCommand(name?: string): void;
        /**
         * Register an Command object in the ChairWoom console
         * @param commands Command object to register
         */
        registerCommand(commands: Commands): void;
    }
    export default ChairConsole;
}
declare module "classes/ModuleManager" {
    import ChairWoom from "classes/ChairWoom";
    import { ChairModules } from "interfaces";
    export class ModuleManager {
        modules: ChairModules;
        bot: ChairWoom;
        /**
         * Initialize a new instance of the ModuleManager
         * @param bot The instance of ChairWoom
         * @returns The ModuleManager
         */
        constructor(bot: ChairWoom);
        /**
         * Read the module folder
         */
        private readDir;
        /**
         * Load a module
         * @param dir The dir that contain the modules
         * @param file The file that contain the main class
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
    export default ModuleManager;
}
declare module "classes/PluginManager" {
    import ChairWoom from "classes/ChairWoom";
    import { ChairPlugins } from "interfaces";
    export class PluginManager {
        bot: ChairWoom;
        plugins: ChairPlugins;
        constructor(bot: ChairWoom);
        /**
         * Reads the plugin folder
         */
        private readDir;
        /**
         * Load a plugin
         * @param {String} dir The dir that contain the plugin
         * @param {String} file The file that contain the main class
         */
        loadPlugin(dir: string): void;
        /**
         * Unloads a plugin from ChairWoom
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
