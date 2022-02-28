import ChairConsole from "./Console";
export declare let BasicCommands: {
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
