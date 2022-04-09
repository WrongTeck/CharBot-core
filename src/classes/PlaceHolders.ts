import Logger from "./Logger";
import { PlaceHolder } from '../interfaces';


//The error messages are english only to prevent empty error messages
export class PlaceHolders {
  /**
   * The logger instance
   */
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
    if(typeof data !== "string" || !data) {
      this.logger.grave("No data or invalid data incoming in the PlaceHolder Parser!");
      return data;
    }
    if(!placeHolders) return data.toString();
    if(typeof placeHolders !== "object") {
      this.logger.grave("Invalid PlaceHolder Object!");
      return data;
    }
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