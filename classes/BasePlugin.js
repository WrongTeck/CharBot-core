const Base = require("./Base");
class BasePlugin extends Base {
  /**
   * Initialize a Plugin
   * @param {string} name The name of the plugin (MUST be UNIQUE!)
   * @param {class} plugin Your plugin class (this)
   * @param {Base} bot The bot
   * @returns The Plugin
   */
    constructor(name, plugin, bot) {
      let data = {};
      Object.defineProperty(data, name, {writable: false, value: plugin});
      super(bot, data);
      return this;
    }
  }

module.exports = BasePlugin;