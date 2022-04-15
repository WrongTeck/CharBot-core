import Logger from "./Logger";
import { terminal } from "terminal-kit";
import ChairWoom from "./ChairWoom";
const term = terminal;
import { Commands } from "../interfaces";

export class ChairConsole extends Logger {
  /**
   * The last command typed in the console
   */
  lastCommand: string;
  /**
   * The terminal manger (terminal-kit)
   */
  term: any;
  /**
   * The commands that are loaded in the bot
   */
  commands: Commands;
  /**
   * Retries
   */
  stops: number = 0;
  /**
   * Initialize a new instance of the ChairConsole
   * @param Chairbot The instance that called the Console
   */
  constructor(public bot: ChairWoom) {
    super(bot);
    super.executor = this.command;
    this.commands = {};
    this.registerCommand({});
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
  private key(name: string) {
    if (name == "CTRL_C") {
      //this.log(this.bot.lang.files.core.commands.shutdown_message);
      this.bot.emit("core.1shutdown");
      for(let ChairPlugin in this.bot.pm.plugins) {
        this.bot.pm.unloadPlugin(ChairPlugin, { unloadDependecies: true });
      }
      this.lastCons.abort();
      process.stdout.clearLine(0);
      process.stdout.clearLine(1);
      setTimeout(() => {
        this.term.clear();
        process.exit(0);
      }, 1500);
    }
  }
  /**
   * Handles commands inside ChairWoom
   * @param last The last command typed
   * @returns An error if any
   */
  command(last: string) {
    if (!last) return this.enter();
    if (last.includes(" ")) {
      this.addHistory(last);
      if (!Object.keys(this.commands).includes(last.split(" ")[0])) {
        return this.error(this.bot.lang.files.core.commands.invalid_command, {
          command: last.split(" ")[0],
        });
      }
      Object.values(this.commands)[
        Object.keys(this.commands).indexOf(last.split(" ")[0])
      ](this, last.split(" "));
    } else {
      this.addHistory(last);
      if (!Object.keys(this.commands).includes(last)) {
        return this.error(this.bot.lang.files.core.commands.invalid_command, {
          command: last.split(" ")[0],
        });
      } else if (
        typeof Object.values(this.commands)[
          Object.keys(this.commands).indexOf(last)
        ] == "function"
      ) {
        Object.values(this.commands)[Object.keys(this.commands).indexOf(last)](
          this,
          []
        );
      }
    }
  }
  /**
   * Create an input field for the ChairWoom console
   */
  enter() {
    term.inputField(
      {
        echo: true,
        autoCompleteHint: true,
        autoComplete: Object.keys(this.commands),
        history: this.history,
      },
      (err, arg) => {
        if (err) return this.error(err);
        this.executor(arg);
      }
    );
  }
  /**
   * Unregister a command from the Console
   * If no arguments is passed all commands will be unload
   * except of the basic ones
   * @param name Command name
   */
  unregisterCommand(name?: string) {
    this.bot.emit("core.console.unregister", name);
    if (name) {
      delete this.commands[name];
    } else {
      delete this.commands;
    }
    this.commands = {};
    const { BasicCommands } = require("./Commands");
    Object.assign(this.commands, BasicCommands);
  }
  /**
   * Register an Command object in the ChairWoom console
   * @param commands Command object to register
   */
  registerCommand(commands: Commands) {
    this.bot.emit("core.console.register", Object.keys(commands));
    if (this.commands) {
      this.commands = Object.assign(this.commands, commands);
      super.commands = this.commands;
    } else {
      this.commands = commands;
      super.commands = this.commands;
    }
    const { BasicCommands } = require("./Commands");
    Object.assign(this.commands, BasicCommands);
  }
}

export default ChairConsole;
