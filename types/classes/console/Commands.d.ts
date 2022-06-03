import ChairConsole from "./Console";
export declare let BasicCommands: {
    stop(console: ChairConsole): void;
    exit(console: ChairConsole): void;
    clearLogs(c: ChairConsole): void;
    history(c: ChairConsole): void;
    commands(c: ChairConsole): void;
    help(console: ChairConsole): void;
    reload(c: ChairConsole, args: string[]): void;
    clear(console: ChairConsole): void;
    repo(console: ChairConsole, args: string[]): void;
    plugins(c: ChairConsole): void;
    configs(c: ChairConsole): void;
};
export default BasicCommands;
