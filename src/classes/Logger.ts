import { terminal } from "terminal-kit";
import moment from "moment";
import { appendFile, mkdir } from "fs";
import { PlaceHolder, PlaceHolders } from "./PlaceHolders";
import { Commands } from "./Commands";

export class Logger extends PlaceHolders {
  filename: string;
  commands: Commands;
  executor: Function;
  history: Array<string>;
  last: boolean;
  lastCons: any;
  constructor() {
    super();
    super.logger = this;
    if(!this.filename) {
      this.filename = moment().format("HH-mm-ss") + "-charbot";
    }
    this.history = [];
    this.last = false;
    return this;
  }
  addHistory(command: string) {
    this.history.push(command);
  }
  file(message: string, type: string) {
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
  cons() {
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
  prelog(type: string, message: string) {
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
  log(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("INFO", message);
    for (let i in message.split("\n")) {
      terminal.white(
        super.parse(
          data +`[${time}] [INFO] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  warn(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("WARN", message);
    for (let i in message.split("\n")) {
      terminal.yellow(
        super.parse(
          `${data}[${time}] [WARN] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  error(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("ERROR", message);
    for (let i in message.split("\n")) {
      terminal.red(
        super.parse(
          `${data}[${time}] [ERROR] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  grave(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("GRAVE", message);
    for (let i in message.split("\n")) {
      terminal.red(
        super.parse(
          `${data}[${time}] [GRAVE] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  ml(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("Module Loader", message);
    for (let i in message.split("\n")) {
      terminal.brightGreen(
        super.parse(
          `${data}[${time}] [Module Loader] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  pl(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("Plugin Loader", message);
    for (let i in message.split("\n")) {
      terminal.brightGreen(
        super.parse(
          `${data}[${time}] [Plugin Loader] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  mu(message: string, placeholders?: PlaceHolder) {
    let [data, time] = this.prelog("Module Unloader", message);
    for (let i in message.split("\n")) {
      terminal.brightRed(
        super.parse(
          `${data}[${time}] [Module Unloader] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  pu(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("Plugin Unloader", message);
    for (let i in message.split("\n")) {
      terminal.brightRed(
        super.parse(
          `${data}[${time}] [Plugin Unloader] ${message.split("\n")[i]}`,
          placeholders
        )
      );
    }
    this.cons();
    this.last = true;
  }
  fatal(message: string, placeholders?: PlaceHolder) {
    message = message.toString();
    let [data, time] = this.prelog("FATAL", message);
    for (let i in message.split("\n")) {
      terminal.bgRed(
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

export default Logger;