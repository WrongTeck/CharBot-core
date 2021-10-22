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
    this.last = false;
    process.stdin.on("data", () => {
      this.last = false;
    });
    return this;
  }
  /**
   * Append a command to the history of typed commands
   * @param {String} command The command to append to the history
   */
  addHistory(command) {
    this.history.push(command);
  }

  /**
   * @param {string} message The message to write
   */
  file(message, type) {
    let data;
    if (type == "INPUT") {
      data = `> ${message}\n`;
    } else {
      data = `[${moment().format("HH-mm-ss")}] [${type}] ${message}\n`;
    }
    fs.appendFile(`./logs/${this.filename}.log`, data, (err) => {
      if (err) {
        fs.mkdir("./logs", (err1) => {
          if (err1) console.log(err1);
        });
      }
    });
  }
  /**
   * Return the console
   */
  cons() {
    process.stdout.write("\n> ");
    this.lastcons = term.inputField(
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
   * Runs pre-logging hooks
   * @param {String} type Logging level
   * @param {String} message Message to process
   */
  prelog(type, message) {
    let data;
    const time = moment().format("HH:mm:ss");
    this.file(message, type);
    if (this.last) {
      this.lastcons.abort();
      process.stdout.clearLine();
      process.stdout.moveCursor(-2, 0)
      data = ``;
    } else {
      data = "\n";
    }
    return [data, time];
  }
  /**
   * Write a message in console as INFO
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  log(message, placeholders) {
    message = message.toString();
    let [data, time] = this.prelog("INFO", message);
    for (let i in message.split("\n")) {
      term.white(
        super.parse(
          data +`[${time}] [INFO] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }

  /**
   * Write a message in console as WARN
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  warn(message, placeholders) {
    message = message.toString();
    let [data, time] = this.prelog("WARN", message);
    for (let i in message.split("\n")) {
      term.yellow(
        super.parse(
          `${data}[${time}] [WARN] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Write an ERROR to console
   * @param {string} message The message to print
   * @param {Object} placeholders Custom PlaceHolders
   */
  error(message, placeholders) {
    message = message.toString();
    let [data, time] = this.prelog("WARN", message);
    for (let i in message.split("\n")) {
      term.red(
        super.parse(
          `${data}[${time}] [ERROR] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Print a GRAVE error to console
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  grave(message, placeholders) {
    message = message.toString();
    let [data, time] = this.prelog("WARN", message);
    for (let i in message.split("\n")) {
      term.red(
        super.parse(
          `${data}[${time}] [GRAVE] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Print a Module Loader message,
   * should be used only by the core
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  ml(message, placeholders) {
    message = message.toString();
    let [data, time] = this.prelog("WARN", message);
    for (let i in message.split("\n")) {
      term.brightGreen(
        super.parse(
          `${data}[${time}] [Module Loader] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Print a Plugin loader message
   * Should be used only by the core
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  pl(message, placeholders) {
    message = message.toString();
    let [data, time] = this.prelog("WARN", message);
    for (let i in message.split("\n")) {
      term.brightGreen(
        super.parse(
          `${data}[${time}] [Plugin Loader] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Print a Module Unloader message
   * Should be used only by the core
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  mu(message, placeholders) {
    let [data, time] = this.prelog("WARN", message);
    for (let i in message.split("\n")) {
      term.brightRed(
        super.parse(
          `${data}[${time}] [Module Unloader] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Print a Plugin unloader message
   * Should be used only by the core
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  pu(message, placeholders) {
    message = message.toString();
    let [data, time] = this.prelog("WARN", message);
    for (let i in message.split("\n")) {
      term.brightRed(
        super.parse(
          `${data}[${time}] [Plugin Unloader] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  /**
   * Send a FATAL error to the console
   * This message will terminate the bot when called
   * @param {string} message The message
   * @param {Object} placeholders Custom PlaceHolders
   */
  fatal(message, placeholders) {
    message = message.toString();
    let [data, time] = this.prelog("WARN", message);
    for (let i in message.split("\n")) {
      term.bgRed(
        super.parse(
          `${data}[${time}] [FATAL] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
}

module.exports = Logger;
