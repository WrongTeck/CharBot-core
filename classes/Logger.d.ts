import { PlaceHolder, PlaceHolders } from "./PlaceHolders";
import { Commands } from "./Commands";
export declare class Logger extends PlaceHolders {
    filename: string;
    commands: Commands;
    executor: Function;
    history: Array<string>;
    last: boolean;
    lastCons: any;
    constructor();
    addHistory(command: string): void;
    file(message: string, type: string): void;
    cons(): void;
    prelog(type: string, message: string): string[];
    log(message: string, placeholders?: PlaceHolder): void;
    warn(message: string, placeholders?: PlaceHolder): void;
    error(message: string, placeholders?: PlaceHolder): void;
    grave(message: string, placeholders?: PlaceHolder): void;
    ml(message: string, placeholders?: PlaceHolder): void;
    pl(message: string, placeholders?: PlaceHolder): void;
    mu(message: string, placeholders?: PlaceHolder): void;
    pu(message: string, placeholders?: PlaceHolder): void;
    fatal(message: string, placeholders?: PlaceHolder): void;
}
export default Logger;
