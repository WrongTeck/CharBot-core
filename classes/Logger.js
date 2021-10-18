const term = require("terminal-kit").terminal;
const moment = require("moment");
const fs = require("fs");
const PlaceHolders = require("./PlaceHolders");
class Logger extends PlaceHolders {
  /**
   * Create a new Logger instance
   * @param {Object} commands Commands to register
   * @returns
   */
  constructor(commands) {
    super();
    super.logger = this;
    if (!this.filename) {
      this.filename = moment().format(`HH-mm-ss`) + "-chairbot";
    }
    /**
     * Commands registered
     * @type {Object}
     */
    this.commands = commands;
    /**
     * The executor of the commands
     * @type {Function}
     */
    this.executor;
    /**
     * The history of commands typed in this session
     * @type {Array<String>}
     */
    this.history = [];
    return this;
  }
  addHistory(command) {
    this.history.push(command);
  }
  /**
   * @param {string} message The message to write
   */
  file(message, type) {
    let data;
    if(type == "INPUT") {
      data = `> ${message}\n`;
    } else {
    data = `[${moment().format("HH-mm-ss")}] [${type}] ${message}\n`;
  }
    fs.appendFile(
      `./logs/${this.filename}.log`,
      data,
      (err) => {
        if (err) {
          fs.mkdir("./logs", (err1) => {
            if (err1) console.log(err1);
          });
        }
      }
    );
  }
  /**
   * Return the console
   */
  cons() {
    term.inputField(
      {
        echo: true,
        autoCompleteHint: true,
        autoComplete: Object.keys(this.commands),
        history: this.history,
      },
      (err, arg) => {
        if (err) return this.error(err);
        this.file(arg, "INPUT");
        this.executor(arg);
      }
    );
  }
  /**
   * Write a message in console as INFO
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  log(message, placeholders) {
    message = message.toString();
    const time = moment().format("HH:mm:ss");
    this.file(message, "INFO");
    for (let i in message.split("\n")) {
      term.white(super.parse(`\n[${time}] [INFO] ${message.split("\n")[i]}`, placeholders));
    }
    process.stdout.write("\n> ");
    this.cons();
  }

  /**
   * Write a message in console as WARN
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  warn(message, placeholders) {
    message = message.toString();
    const time = moment().format("HH:mm:ss");
    this.file(message, "WARN");
    for (let i in message.split("\n")) {
      term.yellow(super.parse(`\n[${time}] [WARN] ${message.split("\n")[i]}`, placeholders));
    }
    process.stdout.write("\n> ");
    this.cons();
  }
  /**
   * Write an ERROR to console
   * @param {string} message The message to print
   * @param {Object} placeholders Custom PlaceHolders
   */
  error(message, placeholders) {
    message = message.toString();
    const time = moment().format("HH:mm:ss");
    this.file(message, "ERROR");
    for (let i in message.split("\n")) {
      term.red(super.parse(`\n[${time}] [ERROR] ${message.split("\n")[i]}`, placeholders));
    }
    process.stdout.write("\n> ");
    this.cons();
  }
  /**
   * Print a GRAVE error to console
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  grave(message, placeholders) {
    message = message.toString();
    const time = moment().format("HH:mm:ss");
    this.file(message, "GRAVE");
    for (let i in message.split("\n")) {
      term.red(super.parse(`\n[${time}] [GRAVE] ${message.split("\n")[i]}`, placeholders));
    }
    process.stdout.write("\n> ");
    this.cons();
  }
  /**
   * Print a Module Loader message,
   * should be used only by the core
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  ml(message, placeholders) {
    message = message.toString();
    const time = moment().format("HH:mm:ss");
    this.file(message, "Module Loader");
    for (let i in message.split("\n")) {
      term.brightGreen(super.parse(`\n[${time}] [Module Loader] ${message.split("\n")[i]}`, placeholders));
    }
    process.stdout.write("\n> ");
    this.cons();
  }
  /**
   * Print a Plugn loader message
   * Should be used only by the core
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  pl(message, placeholders) {
    message = message.toString();
    const time = moment().format("HH:mm:ss");
    this.file(message, "Plugin Loader");
    for (let i in message.split("\n")) {
      term.brightGreen(super.parse(`\n[${time}] [Plugin Loader] ${message.split("\n")[i]}`, placeholders));
    }
    process.stdout.write("\n> ");
    this.cons();
  }
  /**
   * Print a Module Unloader message
   * Should be used only by the core
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  mu(message, placeholders) {
    message = message.toString();
    const time = moment().format("HH:mm:ss");
    this.file(message, "Module Unloader");
    for (let i in message.split("\n")) {
      term.brightRed(super.parse(`\n[${time}] [Module Unloader] ${message.split("\n")[i]}`, placeholders));
    }
    process.stdout.write("\n> ");
    this.cons();
  }
  /**
   * Print a Plugin unloader message
   * Should be used only by the core
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  pu(message, placeholders) {
    message = message.toString();
    const time = moment().format("HH:mm:ss");
    this.file(message, "Plugin Unloader");
    for (let i in message.split("\n")) {
      term.brightRed(super.parse(`\n[${time}] [Plugin Unloader] ${message.split("\n")[i]}`, placeholders));
    }
    process.stdout.write("\n> ");
    this.cons();
  }
  /**
   * Send a FATAL error to the console
   * This message will terminate the bot when called
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  fatal(message, placeholders) {
    message = message.toString();
    const time = moment().format("HH:mm:ss");
    this.file(message, "FATAL");
    for (let i in message.split("\n")) {
      term.bgRed.white(super.parse(`\n[${time}] [FATAL] ${message.split("\n")[i]}`, placeholders));
    }
    process.stdout.write("\n> ");
    this.commands.stop(this);
  }
}

module.exports = Logger;
