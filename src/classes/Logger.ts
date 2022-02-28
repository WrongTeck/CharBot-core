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
    let data: string;
    const time = moment().format("HH:mm:ss");
    this.file(message, type);
    if(this.last) {
      this.lastCons.abort();
      process.stdout.clearLine(0);
      process.stdout.moveCursor(-process.stdout.getWindowSize()[0], 0);
      data = "";
    } else {
      data = "\n";
    }
    return [data, time];
  }
  /**
   * Print a formatted message to the console with LOG level
   * @param message The message to log
   * @param placeholders An object with PlaceHolder data
   */
  log(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("INFO", message);
    for (let i in message.split("\n")) {
      let parsedMessage = super.parse(
        message.split("\n")[i],
        placeholders
      );
      this.bot.emit("core.logger.log", parsedMessage)
      terminal.white(
        data + `[${time}] [INFO] ${parsedMessage}`
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Print a formatted message to console with WARN level
   * @param message The message to print
   * @param placeholders A PlaceHolder object
   */
  warn(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("WARN", message);
    for (let i in message.split("\n")) {
      let parsedMessage = super.parse(
        message.split("\n")[i],
        placeholders
      );
      this.bot.emit("core.logger.warn", parsedMessage)
      terminal.yellow(
        data + `[${time}] [WARN] ${parsedMessage}`
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Prints a formatted message to the console with ERROR level
   * @param message The message to print
   * @param placeholders A PlaceHolder object
   */
  error(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("ERROR", message);
    for (let i in message.split("\n")) {
      let parsedMessage = super.parse(
        message.split("\n")[i],
        placeholders
      );
      this.bot.emit("core.logger.error", parsedMessage)
      terminal.red(
        data + `[${time}] [ERROR] ${parsedMessage}`
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Print a message to the console with GRAVE level
   * @param message The message to print
   * @param placeholders A PlaceHolder object
   */
  grave(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("GRAVE", message);
    for (let i in message.split("\n")) {
      let parsedMessage = super.parse(
        message.split("\n")[i],
        placeholders
      );
      this.bot.emit("core.logger.grave", parsedMessage)
      terminal.red(
        data + `[${time}] [GRAVE] ${parsedMessage}`
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Prints a message to console with Module Loader level
   * Should be used **ONLY** by the ModuleManager
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  ml(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("Module Loader", message);
    for (let i in message.split("\n")) {
      let parsedMessage = super.parse(
        message.split("\n")[i],
        placeholders
      );
      this.bot.emit("core.logger.moduleLoader", parsedMessage)
      terminal.brightGreen(
        data + `[${time}] [Module Loader] ${parsedMessage}`
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Prints a formatted message to the console with Plugin Loader level
   * Should be used **ONLY** by the PluginManager
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  pl(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("Plugin Loader", message);
    for (let i in message.split("\n")) {
      let parsedMessage = super.parse(
        message.split("\n")[i],
        placeholders
      );
      this.bot.emit("core.logger.pluginLoader", parsedMessage)
      terminal.brightGreen(
        data + `[${time}] [Plugin Loader] ${parsedMessage}`
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Print a formatted message to the console with Module Unload level
   * Should be used **ONLY** by the ModuleManager
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  mu(message: string, placeholders?: PlaceHolder) {
    let [data, time] = this.prelog("Module Unloader", message);
    for (let i in message.split("\n")) {
      let parsedMessage = super.parse(
        message.split("\n")[i],
        placeholders
      );
      this.bot.emit("core.logger.moduleUnloader", parsedMessage)
      terminal.brightRed(
        data + `[${time}] [Module Unloader] ${parsedMessage}`
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Prints a message to the console with Plugin Unload level
   * Should be used **ONLY** by the PluginManager
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  pu(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("Plugin Unloader", message);
    for (let i in message.split("\n")) {
      let parsedMessage = super.parse(
        message.split("\n")[i],
        placeholders
      );
      this.bot.emit("core.logger.pluginUnloader", parsedMessage)
      terminal.white(
        data + `[${time}] [Plugin Unloader] ${parsedMessage}`
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Prints a message to the console with FATAL level
   * **WARN**: This also will trigger the shutdown of the bot!
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  fatal(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("FATAL", message);
    for (let i in message.split("\n")) {
      let parsedMessage = super.parse(
        message.split("\n")[i],
        placeholders
      );
      this.bot.emit("core.logger.fatal", parsedMessage)
      terminal.bgRed(
        data + `[${time}] [FATAL] ${parsedMessage}`
      );
    }
    this.bot.stop();
  }
  /**
   * If debug mode is enabled, prints a formatted message to the console with DEBUG level
   * @param message The message to print
   * @param placeholders PlaceHolder data
   */
  debug(message: string, placeholders?: PlaceHolder) {
    if(this.bot.config.core.debug) {
      message = message.toString();
      let [data, time] = this.prelog("DEBUG", message);
      for (let i in message.split("\n")) {
        let parsedMessage = super.parse(
          message.split("\n")[i],
          placeholders
        );
        this.bot.emit("core.logger.debug", parsedMessage)
        terminal.brightBlue(
          data + `[${time}] [DEBUG] ${parsedMessage}`
        );
      }
    }
    this.cons();
    this.last = true;
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