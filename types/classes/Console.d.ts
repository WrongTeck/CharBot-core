import { Logger } from "./Logger";
import ChairWoom from "./ChairWoom";
import { Commands } from "../interfaces";
export declare class ChairConsole extends Logger {
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
