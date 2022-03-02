import Logger from "./Logger";
import { PlaceHolder } from '../interfaces';
export declare class PlaceHolders {
    logger: Logger;
    constructor();
    parse(data: string, placeHolders: PlaceHolder): string;
}
export default PlaceHolders;
