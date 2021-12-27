import CharConsole from "./Console";
export interface Command {
    (console: CharConsole, args?: Array<string>): null;
}
export interface Commands {
    [propName: string]: Command;
}
export declare let BasicCommands: {
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
