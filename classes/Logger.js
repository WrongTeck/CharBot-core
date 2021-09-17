const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');

class Logger {
  constructor(consoledefault) {
    this.console = consoledefault;
    if (!this.log) {
        this.log = moment().format(`HH-mm-ss`) + '-chairbot';
    }
    return this;
  }
  file(message) {
    fs.appendFile(`./logs/${log}.log`, `[${time}] [${type}] ${message}\n`, (err) => {
      if (err) {
        fs.mkdir('./logs', (err => {
          if (err) console.log(err);
        }));
      }
      
      process.stdout.clearLine();
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    });
  }
  log(message) {
    const time = moment().format('HH:mm:ss');
    this.file(message);
    this.console.log(chalk.white(`[${time}] [${type}] ${message.split('\n')[i]}`));
  }
}