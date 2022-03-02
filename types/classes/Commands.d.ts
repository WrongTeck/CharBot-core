import ChairConsole from "./Console";
export declare let BasicCommands: {
    stop(console: ChairConsole): void;
    exit(console: ChairConsole): void;
    clearLogs(console: ChairConsole): void;
    history(console: ChairConsole): void;
    commands(console: any): void;
    help(console: ChairConsole): void;
    reloadLang(console: ChairConsole): void;
    clear(console: ChairConsole): void;
    reloadCommands(console: ChairConsole): void;
    repo(console: ChairConsole, args: string[]): void;
};
export default BasicCommands;
