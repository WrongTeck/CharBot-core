const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');
class Logger {
  /**
   * Create a new Logger instance
   * @returns
   */
  constructor() {
    this.console = console;
    if (!this.filename) {
        this.filename = moment().format(`HH-mm-ss`) + '-chairbot';
    }
    return this;
  }
  /**
   * @param {string} message The message to write
   */
  file(message, type) {
    fs.appendFile(`./logs/${this.filename}.log`, `[${moment().format("HH-mm-ss")}] [${type}] ${message}\n`, (err) => {
      if (err) {
        fs.mkdir('./logs', (err1 => {
          if (err1) console.log(err1);
        }));
      }
    });
  }

  /**
   * Write a message in console as INFO
   * @param {string} message The message
   */
  log(message) {
    const time = moment().format('HH:mm:ss');
    this.file(message, "INFO");
    for(let i in message.split("\n")) {
        this.console.log(chalk.white(`\n[${time}] [INFO] ${message.split('\n')[i]}`));
    }
    process.stdout.write('> ');
  }

  /**
   * Write a message in console as WARN
   * @param {string} message The message
   */
  warn(message) {
    const time = moment().format("HH:mm:ss");
    this.file(message, "WARN");
    for(let i in message.split("\n")) {
        this.console.log(chalk.yellow(`\n[${time}] [WARN] ${message.split("\n")[i]}`));
    }
    process.stdout.write('> ');
  }
  /**
   * Write an ERROR to console
   * @param {string} message The message to print
   */
    error(message) {
        const time = moment().format("HH:mm:ss");
        this.file(message, "ERROR");
        for(let i in message.split("\n")) {
            this.console.log(chalk.red(`\n[${time}] [ERROR] ${message.split("\n")[i]}`));
        }
        process.stdout.write('> ');
    }
    /**
     * Print a GRAVE error to console
     * @param {string} message The message
     */
  grave(message) {
    const time = moment().format("HH:mm:ss");
    this.file(message, "GRAVE");
    for(let i in message.split("\n")) {
        this.console.log(chalk.red(`\n[${time}] [GRAVE] ${message.split("\n")[i]}`));
    }
    process.stdout.write('> ');
  }
  /**
   * Print a Module Loader message,
   * should be used only by the core
   * @param {string} message The message
   */
  ml(message) {
      const time = moment().format("HH:mm:ss");
    this.file(message, "Module Loader");
    for(let i in message.split("\n")) {
        this.console.log(chalk.greenBright(`\n[${time}] [Module Loader] ${message.split("\n")[i]}`));
    }
    process.stdout.write('> ');
    }
    /**
     * Print a Plugn loader message
     * Should be used only by the core
     * @param {string} message The message
     */
    pl(message) {
        const time = moment().format("HH:mm:ss");
    this.file(message, "Plugin Loader");
    for(let i in message.split("\n")) {
        this.console.log(chalk.greenBright(`\n[${time}] [Plugin Loader] ${message.split("\n")[i]}`));
    }
    process.stdout.write('> ');
    }
    /**
     * Print a Module Unloader message
     * Should be used only by the core
     * @param {string} message The message
     */
    mu(message) {
        const time = moment().format("HH:mm:ss");
        this.file(message, "Module Unloader");
        for(let i in message.split("\n")) {
            this.console.log(chalk.redBright(`\n[${time}] [Module Unloader] ${message.split("\n")[i]}`));

        }
        process.stdout.write('> ');
    }
    /**
     * Print a Plugin unloader message
     * Should be used only by the core
     * @param {string} message The message
     */
    pu(message) {
        const time = moment().format("HH:mm:ss");
        this.file(message, "Plugin Unloader");
        for(let i in message.split("\n")) {
            this.console.log(chalk.redBright(`\n[${time}] [Plugin Unloader] ${message.split("\n")[i]}`));
        }
        process.stdout.write('> ');
    }
    /**
     * Send a FATAL error to the console
     * This message will terminate the bot when called
     * @param {string} message The message
     */
    fatal(message) {
        const time = moment().format("HH:mm:ss");
        this.file(message, "FATAL");
        for(let i in message.split("\n")) {
            this.console.log(chalk.bgRed.white(`\n[${time}] [FATAL] ${message.split("\n")[i]}`));
        }
        process.stdout.write('> ');
        // Need to call the stop function in the Core
    }
}

module.exports = Logger;