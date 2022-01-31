import { Logger } from "./Logger";
import { terminal } from "terminal-kit";
import CharBot from "./CharBot";
const term = terminal;
import { Commands, BasicCommands } from "./Commands";

export class CharConsole extends Logger {
  lastCommand: string;
  bot: CharBot;
  term: any;
  commands: Commands;
  /**
   * Initialize a new instance of the CharConsole
   * @param charbot The instance that called the Console
   */
  constructor(charbot: CharBot) {
    super(charbot);
    super.executor = this.command;
    this.bot = charbot;
    this.commands = {};
    Object.assign(this.commands, BasicCommands);
    this.history = [];
    this.lastCommand = "";
    this.term = term;
    term.grabInput(true);
    term.fullscreen(true);
    term.on("key", this.key);
  }
  /**
   * Handle a key/combination of keys
   * @param name The key name
   */
  private key(name: string, matches: string) {
    if(name.startsWith("CTRL") && name != "CTRL_C") return;
    if(name == "CTRL_C") {
        try {
          this.commands.stop(this);
        } catch (e) {
          this.fatal("Something is broken! Hard exit...");
          process.exit(1);
        }
    }
  }
  /**
   * Handles commands inside CharBot
   * @param last The last command typed
   * @returns An error if any
   */
  command(last: string) {
    if(!last) return this.enter();
    if(last.includes(" ")) {
      this.addHistory(last);
      if(!Object.keys(this.commands).includes(last.split(" ")[0])) {
        return this.error(this.bot.lang.commands.invalid_command, { command: last.split(" ")[0] });
      }
      Object.values(this.commands)[Object.keys(this.commands).indexOf(last.split(" ")[0])](this, last.split(" "));
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
   * Create an input field for the CharBot console
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
   * Unregister a command from the Console
   * If no arguments is passed all commands will be unload
   * except of the basic ones 
   * @param name Command name
   */
  unregisterCommand(name?: string) {
    if(name) {
      delete this.commands[name];
    } else {
      delete this.commands;
    }
    this.commands = {};
    Object.assign(this.commands, BasicCommands);
  }
  /**
   * Register an Command object in the CharBot console
   * @param commands Command object to register
   */
  registerCommand(commands: Commands) {
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

export default CharConsole;