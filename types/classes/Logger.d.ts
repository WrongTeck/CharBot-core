import PlaceHolders from "./PlaceHolders";
import { Commands, PlaceHolder } from "../interfaces";
import { ChairWoom } from "..";
export declare class Logger extends PlaceHolders {
    bot: ChairWoom;
    filename: string;
    commands: Commands;
    executor: Function;
    history: Array<string>;
    last: boolean;
    lastCons: any;
    constructor(bot: ChairWoom);
    addHistory(command: string): void;
    private file;
    private cons;
    private prelog;
    log(message: string, placeholders?: PlaceHolder): void;
    warn(message: string, placeholders?: PlaceHolder): void;
    error(message: string, placeholders?: PlaceHolder): void;
    grave(message: string, placeholders?: PlaceHolder): void;
    ml(message: string, placeholders?: PlaceHolder): void;
    pl(message: string, placeholders?: PlaceHolder): void;
    mu(message: string, placeholders?: PlaceHolder): void;
    pu(message: string, placeholders?: PlaceHolder): void;
    fatal(message: string, placeholders?: PlaceHolder): void;
    debug(message: string, placeholders?: PlaceHolder): void;
    rearm(): void;
}
export default Logger;
