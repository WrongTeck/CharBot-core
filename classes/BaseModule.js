const Base = require("./Base");
/**
 * The Class to initialize a module
 */
class BaseModule extends Base {
    /**
     * Initialize the Module
     * @param {string} name The Module Name (MUST be UNIQUE!)
     * @param {class} modulea The module class (this)
     * @param {Base} bot The bot
     * @returns The module
     */
    constructor(name, modulea, bot) {
        let data = {};
      Object.defineProperty(data, name, {writable: false, value: modulea});
      super(bot, data);
        return this;
    }
}

module.exports = BaseModule;