import { terminal } from "terminal-kit";
import moment from "moment";
import { appendFile, mkdir } from "fs";
import PlaceHolders from "./PlaceHolders";
import { Commands, PlaceHolder } from "../interfaces";
import { ChairWoom } from "..";

export default class Logger extends PlaceHolders {
  /**
   * The filename of the log
   */
  private filename: string;
  /**
   * Commands that are registered
   */
  commands: Commands;
  /**
   * An executor for the commands
   */
  executor: Function;
  /**
   * History of commands typed
   */
  history: Array<string>;
  /**
   * Working on redoing this!
   * Whatever or not if the console is already active
   */
  last: boolean = false;
  /**
   * The last active console if any
   */
  lastCons: any;
  /**
   * Whatever or not if the "core.shutdown" has been fired
   */
  private isShuttingDown: boolean = false;
  /**
   * If the console is printing a message
   */
  private inUse: boolean = false;
  /**
   * @param bot The ChairBot instance that called the logger
   * @returns A new Logger instance
   */
  constructor(public bot: ChairWoom) {
    super();
    if (!this.filename) {
      this.filename = moment().format("HH-mm-ss") + "-ChairWoom";
    }
    this.history = [];
    this.bot.on("core.shutdown", () => {
      this.isShuttingDown = true;
    });
    return this;
  }
  /**
   * Append a command to the history of the typed commands
   * @param command The command to append
   */
  addHistory(command: string) {
    this.history.push(command);
  }
  /**
   * Append a message with its logging level to the log file
   * @param message The message to log
   * @param type The logging level
   */
  private file(message: string, type: string) {
    if (!this.bot.config.core.logging) return;
    let data: string;
    if (type == "INPUT") {
      data = `> ${message}\n`;
    } else {
      data = `[${moment().format("HH-mm-ss")}] [${type}] ${message}\n`;
    }
    appendFile(`./logs/${this.filename}.log`, data, (err) => {
      if (err) {
        mkdir("./logs", (err1) => {
          if (err1) console.log(err1);
        });
      }
    });
  }
  /**
   * Create a prompt for input
   */
  private cons() {
    process.stdout.write("\n> ");
    this.lastCons = terminal.inputField(
      {
        echo: true,
        autoCompleteHint: true,
        autoComplete: Object.keys(this.commands),
        history: this.history,
      },
      (err, arg) => {
        if (err) return this.error(err);
        process.stdout.moveCursor(-process.stdout.getWindowSize()[0], 1);
        this.file(arg, "INPUT");
        this.executor(arg);
      }
    );
  }
  /**
   * Does all the pre-logging stuff
   * Write to the file and calculate the time
   * @param type The logging level
   * @param message The message to log
   * @returns The time to use in the terminal
   */
  private prelog(type: string, message: string): string {
    const time = moment().format("HH:mm:ss");
    this.file(message, type);
    if(this.lastCons) {
        this.lastCons.abort();
        process.stdout.moveCursor(-process.stdout.getWindowSize()[0], 0);
    }
    if(this.isShuttingDown)
      process.stdout.moveCursor(-process.stdout.getWindowSize()[0], 1);
    return time;
  }
  /**
   * Print something to the stdout with the given options
   * @param message The message to print
   * @param placeholders PlaceHolders
   * @param type Logging level
   * @param color The color to apply at the terminal
   */
  private printer(
    message: string,
    placeholders: PlaceHolder,
    type: string,
    color: string
  ) {
    let interval = setInterval(() => {
      if (this.inUse) return;
      this.inUse = true;
      let multiline = message.includes("\n");
      message = new String(message).toString();
      for (let string of message.split("\n")) {
        let parsedMessage = super.parse(string, placeholders);
        let time = this.prelog(type, parsedMessage);
        terminal[color](`[${time}] [${type}] ${parsedMessage}`);
        this.bot.emit(`core.logger.${type.toLowerCase()}`, parsedMessage);
        if(multiline)
          process.stdout.moveCursor(0, 1);
      }
      if(multiline)
        process.stdout.moveCursor(0, -1);
      clearInterval(interval);
      this.rearm();
      this.inUse = false;
    }, 10);
  }

  /**
   * Print a formatted message to the console with LOG level
   * @param message The message to log
   * @param placeholders An object with PlaceHolder data
   */
  log(message: string, placeholders?: PlaceHolder) {
    this.printer(message, placeholders, "INFO", "white");
  }
  /**
   * Print a formatted message to console with WARN level
   * @param message The message to print
   * @param placeholders A PlaceHolder object
   */
  warn(message: string, placeholders?: PlaceHolder) {
    this.printer(message, placeholders, "WARN", "yellow");
  }
  /**
   * Prints a formatted message to the console with ERROR level
   * @param message The message to print
   * @param placeholders A PlaceHolder object
   */
  error(message: string, placeholders?: PlaceHolder) {
    this.printer(message, placeholders, "ERROR", "red");
  }
  /**
   * Print a message to the console with GRAVE level
   * @param message The message to print
   * @param placeholders A PlaceHolder object
   */
  grave(message: string, placeholders?: PlaceHolder) {
    this.printer(message, placeholders, "GRAVE", "red");
  }
  /**
   * Prints a message to console with Module Loader level
   * Should be used **ONLY** by the ModuleManager
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  ml(message: string, placeholders?: PlaceHolder) {
    this.printer(message, placeholders, "ModuleLoader", "brightGreen");
  }
  /**
   * Prints a formatted message to the console with Plugin Loader level
   * Should be used **ONLY** by the PluginManager
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  pl(message: string, placeholders?: PlaceHolder) {
    this.printer(message, placeholders, "PluginLoader", "brightGreen");
  }
  /**
   * Print a formatted message to the console with Module Unload level
   * Should be used **ONLY** by the ModuleManager
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  mu(message: string, placeholders?: PlaceHolder) {
    this.printer(message, placeholders, "ModuleUnloader", "brightRed");
  }
  /**
   * Prints a message to the console with Plugin Unload level
   * Should be used **ONLY** by the PluginManager
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  pu(message: string, placeholders?: PlaceHolder) {
    this.printer(message, placeholders, "PluginUnloader", "brightRed");
  }
  /**
   * Prints a message to the console with FATAL level
   * **WARN**: This also will trigger the shutdown of the bot!
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  fatal(message: string, placeholders?: PlaceHolder) {
    message = new String(message).toString();
    for (let i in message.split("\n")) {
      let parsedMessage = super.parse(message.split("\n")[i], placeholders);
      terminal.bgRed(`\n[FATAL] ${parsedMessage}`);
    }
    setTimeout(() => {
      this.bot.stop();
    }, 500);
  }
  /**
   * If debug mode is enabled, prints a formatted message to the console with DEBUG level
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  debug(message: string, placeholders?: PlaceHolder) {
    if(this.bot.config.core.debug)
      this.printer(message, placeholders, "DEBUG", "brightBlue");
  }
  /**
   * Reload the prompt
   */
  rearm() {
    if (this.lastCons) {
      this.lastCons.abort();
    }
    if (this.isShuttingDown) return;
    this.cons();
  }
}
