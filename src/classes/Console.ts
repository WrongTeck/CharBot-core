import Logger from "./Logger";
import { Terminal, terminal } from "terminal-kit";
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
  term: Terminal;
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
    //term.fullscreen(true);
    this.term.grabInput({
      mouse: "button",
      safe: false
    });
    this.term.on("key", (name: string) => {
      switch(name) {
        case "BACKSPACE":
          this.buffer = this.buffer.substring(0, this.buffer.length-1);
          break;
        case "CTRL_C":
          console.log("\n");
          try {
            this.bot.stop();
          } catch(e) {
            this.fatal("Something is broken!");
            process.exit(1);
          }
          break;
        case "ENTER":
          this.buffer = "";
          break;
        default:
          if(name.match("^[a-zA-Z0-9]$"))
            this.buffer = this.buffer.concat(name);
          break;
      }
    });
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
    process.stdout.moveCursor(-process.stdout.getWindowSize()[0], -2);
    this.rearm();
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
