import { terminal } from "terminal-kit";
import moment from "moment";
import { appendFile, mkdir } from "fs";
import PlaceHolders from "./PlaceHolders";
import { Commands, PlaceHolder } from "../interfaces";
import { ChairWoom } from "..";

export class Logger extends PlaceHolders {
  filename: string;
  commands: Commands;
  executor: Function;
  history: Array<string>;
  last: boolean;
  lastCons: any;
  private inUse: boolean = false;
  /**
   * @param bot The ChairBot instance that called the logger
   * @returns A new Logger instance
   */
  constructor(public bot: ChairWoom) {
    super();
    super.logger = this;
    if(!this.filename) {
      this.filename = moment().format("HH-mm-ss") + "-Chairbot";
    }
    this.history = [];
    this.last = false;
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
    let data: string;
    if(type == "INPUT") {
      data = `> ${message}\n`;
    } else {
      data = `[${moment().format("HH-mm-ss")}] [${type}] ${message}\n`;
    }
    appendFile(`./logs/${this.filename}.log`, data, (err) => {
      if(err) {
        mkdir("./logs", (err1) => {
          if(err1) console.log(err1);
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
        if(err) return this.error(err);
        this.last = false;
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
   * @returns Whatever or not to print a \n and the time
   */
  private prelog(type: string, message: string) {
    let data: string = "";
    const time = moment().format("HH:mm:ss");
    this.file(message, type);
    if(this.last) {
      this.lastCons.abort();
      process.stdout.clearLine(0);
      process.stdout.moveCursor(-process.stdout.getWindowSize()[0], 0);
    } else {
      data = "\n";
    }
    return [data, time];
  }
  
  private printer(message: string, placeholders: PlaceHolder, type: string, color: string) {
    let interval = setInterval(() => {
      if(this.inUse)
        return;
      this.inUse = true;
      message = new String(message).toString();
      for (let i in message.split("\n")) {
        let [data, time] = this.prelog(type, message);
        let parsedMessage = super.parse(
          message.split("\n")[i],
          placeholders
        );
        this.bot.emit(`core.logger.${type.toLowerCase()}`, parsedMessage)
        terminal[color](
          data + `[${time}] [${type}] ${parsedMessage}`
        );
      }
      clearInterval(interval);
      this.rearm();
      this.last = true;
      this.inUse = false;
    }, 100);
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
      let [data, time] = this.prelog("FATAL", message);
      let parsedMessage = super.parse(
        message.split("\n")[i],
        placeholders
      );
      this.bot.emit("core.logger.fatal", parsedMessage)
      terminal.bgRed(
        data + `[${time}] [FATAL] ${parsedMessage}`
      );
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
    this.printer(message, placeholders, "DEBUG", "brightBlue");
  }
  /**
   * Reload the prompt
   */
  rearm() {
    if(this.lastCons)
      this.lastCons.abort();
    this.cons();
  }
}

export default Logger;