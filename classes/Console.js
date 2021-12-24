const Logger = require("./Logger");
const termkit = require("terminal-kit");
const term = termkit.terminal;
let BasicCommands = {
    /**
   * Reload console commands
   * @param {Console} console 
   */
     reloadCommands(console) {
      console.log(console.bot.lang.commands.reload_commands);
      console.unregisterCommand();
      console.registerCommand(require("./Commands").Commands);
      // Here we should call the bot instance to load again all modules and plugins commands
    },
}
class Console extends Logger {
  /**
   * Initialize a new Console instance
   * @param {Object} commands The commands to register
   * @param {Object} charbot The bot instance
   */
  constructor(commands, charbot) {
    super(commands);
    super.executor = this.command;
    /**
     * The bot instance that created the Console instance
     * @type {Object}
     */
    this.bot = charbot;
    /**
     * Commands registered
     * @type {Object}
     */
    this.commands = commands;
    Object.assign(this.commands, BasicCommands);
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
    /**
     * Shut down softly the console
     * @type {termkit.Terminal}
     */
    this.term = term;
    term.grabInput(true);
    term.fullscreen(true);
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
    if(admitted.includes(name)) return;
    switch (name) {
      case "CTRL_C":
        try {
          this.commands.stop(this);
        } catch (e) {
          this.fatal("Something is broken! Hard exit...");
          process.exit(1);
        }
        break;
    }
  }
  /**
   * Try to execute a command
   * @param {String} last 
   */
  command(last) {
    if(!last) return this.enter();
    if(last.includes(" ")) {
      this.addHistory(last);
      if(!Object.keys(this.commands).includes(last.split(" ")[0])) {
        return this.error(this.bot.lang.commands.invalid_command, { command: last.split(" ")[0] });
      }
      Object.values(this.commands)[Object.keys(this.commands).indexOf(last.split(" ")[0])](this, last.split(" ").shift());
    } else {
      this.addHistory(last);
      if(!Object.keys(this.commands).includes(last)) {
        return this.error(this.bot.lang.commands.invalid_command, { command: last.split(" ")[0] });
      } else if(typeof Object.values(this.commands)[Object.keys(this.commands).indexOf(last)] == "function") {
        Object.values(this.commands)[Object.keys(this.commands).indexOf(last)](this);
      }
    }
  }
  /**
   * Prevents the console from freezing
   */
  enter() {
    term.inputField({
      echo: true,
      autoCompleteHint: true,
      autoComplete: Object.keys(this.commands),
      history: this.history
    }, (err, arg) => {
      if(err) return this.error(err);
      this.executor(arg);
    });
  }
  /**
   * Unregister a command. If none is passed will unregister all commands
   * @param {?String} name The name of the command
   */
  unregisterCommand(name) {
    if(name) {
      delete this.commands[name];
    } else {
      delete this.commands;
    }
    this.commands = {};
    Object.assign(this.commands, BasicCommands);
  }
  /**
   * Register one or more commands
   * @param {Object} commands Commands to register
   */
  registerCommand(commands) {
    if(this.commands) {
      this.commands = Object.assign(this.commands, commands);
      super.commands = this.commands;
    } else {
      this.commands = commands;
      super.commands = this.commands;
    }
    Object.assign(this.commands, BasicCommands);
  }
}

module.exports = Console;
