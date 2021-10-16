const Logger = require("./Logger");
const termkit = require("terminal-kit");
const term = termkit.terminal;

class Console extends Logger {
  /**
   * Initialize a new Console instance
   * @param {Object} commands The commands to register
   */
  constructor(commands) {
    super(commands);
    super.executor = this.command;
    /**
     * Commands registered
     * @type {Object}
     */
    this.commands = commands;
    /**
     * History of the command typed in the current Console session
     * @type {Array<String>}
     */
    this.history = [];
    /**
     * The command that's begin recognized
     * @type {String}
     */
    this.last = "";
    term.grabInput(true);
    term.on("key", (name, matches, data)=>{
      this.character(name)
    });
  }
  /**
   * Recognize what key is pressed and try to recreate a command
   * @param {String} name The name of the key pressed
   */
  character(name) {
    if(name.startsWith("CTRL") && name != "CTRL_C") return;
    let admitted = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_'];
    if(admitted.includes(name)) {
      return;
      process.stdout.write(name);
      this.last = this.last.concat(name);
      termkit.autoComplete(Object.keys(this.commands), this.last, true);
      return;
    }
    switch (name) {
      case "ENTER":
        this.history.push(this.last);
        this.command();
        break;
      case "CTRL_C":
        this.commands.stop();
        break;
      default:
        break;
    }
  }
  /**
   * Try to execute a command
   */
  command(last) {
    if(!last) return;
    if(!Object.keys(this.commands).includes(last)) {
      this.error("Command " + this.last.split(" ")[0] + " does not exists!");
    };
    Object.values(this.commands)[Object.keys(this.commands).indexOf(last)]();
  }
}


module.exports = Console;
