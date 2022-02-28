import Logger from "./Logger";
import { PlaceHolder } from '../interfaces';
export declare class PlaceHolders {
    logger: Logger;
    /**
     * Initialize a new PlaceHolder parser instance
     * @returns The PlaceHolder parser
     */
    constructor();
    /**
     * Replace placeholders with their values, based on the passed PlaceHolder object
     * @param data The unformatted string
     * @param placeHolders The placeholder object to parse
     * @returns The formatted string
     */
    parse(data: string, placeHolders: PlaceHolder): string;
}
export default PlaceHolders;
