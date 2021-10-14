const Logger = require("./Logger");
const term = require("terminal-kit").terminal;
const stream = require("stream");

class Console {
  /**
   * Initialize a new Console instance
   * @param {Object} commands The commands to register
   */
  constructor(commands) {
    /**
     * Commands registered
     * @type {Object}
     */
    this.commands = commands;
    /**
     * History of the command typed in the current Console session
     * @type {Array<String>}
     */
    this.history;
    /**
     * 
     */
  }
}


module.exports = Console;
