import Logger from "./Logger";
export interface PlaceHolder {
    [propName: string]: string;
}
export declare class PlaceHolders {
    logger: Logger;
    constructor();
    parse(data: string, placeHolders: PlaceHolder): string;
}
export default PlaceHolders;
