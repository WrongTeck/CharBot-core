import Logger from "./Logger"

export interface PlaceHolder {
  [propName: string]: any
}

export class PlaceHolders {
  logger: Logger;
  constructor() {
    return this;
  }
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