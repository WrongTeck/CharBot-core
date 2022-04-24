import Logger from "./Logger";
import { Terminal } from "terminal-kit";
import ChairWoom from "../ChairWoom";
import { Commands } from "../../interfaces";
export declare class ChairConsole extends Logger {
    bot: ChairWoom;
    lastCommand: string;
    term: Terminal;
    commands: Commands;
    stops: number;
    constructor(bot: ChairWoom);
    command(last: string): void;
    enter(): void;
    unregisterCommand(name?: string): void;
    registerCommand(commands: Commands): void;
}
export default ChairConsole;
