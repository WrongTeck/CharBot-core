const Logger = require("./Logger");

class PlaceHolders {
  /**
   * Parse PlaceHolders
   * @param {Logger} logger The console instance
   */
  constructor() {
    /**
     * The Logger instance
     * @type {Logger}
     */
    this.logger;
    return this;
  }
  /**
   * Parse an incoming message with placeholders with valid values
   * @param {string} data - Incoming data to be parsed
   * @param {Object} placeholders - Custom PlaceHolders
   * @returns {string} The parsed string or Object
   */
  parse(data, placeholder) {
    if(typeof data !== "string" || !data) return "No data or invalid data incoming in the PlaceHolder Parser!";
    if(!placeholder) return data.toString();
    if(typeof placeholder !== "object") return "Invalid PlaceHolder Object!\n Incoming data:\n"+data;
    let keys = Object.keys(placeholder);
    let values = Object.values(placeholder);
    for (const key in keys) {
      try {
        data = data.replace(`{${keys[key]}}`, values[key]);
      } catch (e) {
        this.logger.error(e);
      }
    }
    return data.toString();
  }
}
module.exports = PlaceHolders;
