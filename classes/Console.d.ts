import { Logger } from "./Logger";
import CharBot from "./CharBot";
import { Commands } from "./Commands";
export declare class CharConsole extends Logger {
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
