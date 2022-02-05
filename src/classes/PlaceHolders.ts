import Logger from "./Logger";
import { PlaceHolder } from '../interfaces';

export class PlaceHolders {
  logger: Logger;
  /**
   * Initialize a new PlaceHolder parser instance
   * @returns The PlaceHolder parser
   */
  constructor() {
    return this;
  }
  /**
   * Replace placeholders with their values, based on the passed PlaceHolder object
   * @param data The unformatted string
   * @param placeHolders The placeholder object to parse
   * @returns The formatted string
   */
  parse(data: string, placeHolders: PlaceHolder) {
    if(typeof data !== "string" || !data) return "No data or invalid data incoming in the PlaceHolder Parser!";
    if(!placeHolders) return data.toString();
    if(typeof placeHolders !== "object") return "Invalid PlaceHolder Object!";
    let keys: Array<string> = Object.keys(placeHolders);
    let values: Array<string> = Object.values(placeHolders);
    for(const key in keys) {
      try {
        data = data.replace(`{${keys[key]}}`, values[key]);
      } catch (e) {
        this.logger.error(e);
      }
    }
    return data.toString();
  }
}

export default PlaceHolders;