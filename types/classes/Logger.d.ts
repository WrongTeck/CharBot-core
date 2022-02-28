import PlaceHolders from "./PlaceHolders";
import { Commands, PlaceHolder } from "../interfaces";
import { ChairWoom } from "..";
export declare class Logger extends PlaceHolders {
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
