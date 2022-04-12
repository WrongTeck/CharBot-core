import Logger from "./Logger";
import ChairWoom from "./ChairWoom";
import { Commands } from "../interfaces";
export declare class ChairConsole extends Logger {
    bot: ChairWoom;
    lastCommand: string;
    term: any;
    commands: Commands;
    constructor(bot: ChairWoom);
    private key;
    command(last: string): void;
    enter(): void;
    unregisterCommand(name?: string): void;
    registerCommand(commands: Commands): void;
}
export default ChairConsole;
