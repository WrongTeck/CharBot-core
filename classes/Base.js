const EventEmitter = require('events');
/**
 * Where everything begins
 */
class Base {
  /**
   * The base class of CharBot
   * @param {Base} bot The bot 
   * @param {Object} data Data to parse
   * @returns The bot instance
   */
    constructor(bot, data) {
      if(bot) {
          if(data !== null && typeof data == "object") {
              Object.assign(this, data);
          }
          return;
      }
      this.event = new EventEmitter();
      if(data !== null && typeof data == "object") {
        Object.assign(bot, data);
      }
      this.on = this.event.on;
      this.modules = {};
      this.plugins = {};
      return this;
    }
    
  }

module.exports = Base;