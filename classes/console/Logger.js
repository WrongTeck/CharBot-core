"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const terminal_kit_1 = require("terminal-kit");
const fs_1 = require("fs");
const PlaceHolders_1 = __importDefault(require("./PlaceHolders"));
function formatTime() {
    let date = new Date();
    var hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
    if (hours < 10)
        hours = `0${hours}`;
    if (minutes < 10)
        minutes = `0${minutes}`;
    if (seconds < 10)
        seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
}
class Logger extends PlaceHolders_1.default {
    constructor(bot) {
        super();
        this.bot = bot;
        this.buffer = "";
        this.last = false;
        this.isShuttingDown = false;
        this.inUse = false;
        if (!this.filename) {
            this.filename = formatTime() + "-ChairWoom";
        }
        this.history = [];
        this.bot.on("core.shutdown", () => {
            this.isShuttingDown = true;
        });
        return this;
    }
    addHistory(command) {
        this.history.push(command);
    }
    file(message, type) {
        if (!this.bot.config.core.logging)
            return;
        let data;
        if (type == "INPUT") {
            data = `> ${message}\n`;
        }
        else {
            data = `[${formatTime()} ${type}] ${message}\n`;
        }
        (0, fs_1.appendFile)(`./logs/${this.filename}.log`, data, (err) => {
            if (err) {
                (0, fs_1.mkdir)("./logs", (err1) => {
                    if (err1)
                        console.log(err1);
                });
            }
        });
    }
    cons() {
        process.stdout.write("\n> ");
        this.lastCons = terminal_kit_1.terminal.inputField({
            default: this.buffer,
            echo: true,
            autoCompleteHint: true,
            autoComplete: Object.keys(this.commands),
            history: this.history,
        }, (err, arg) => {
            if (err)
                return this.error(err);
            process.stdout.moveCursor(-process.stdout.getWindowSize()[0], 1);
            this.file(arg, "INPUT");
            this.executor(arg);
        });
    }
    prelog(type, message) {
        const time = formatTime();
        this.file(message, type);
        console.log("\n");
        process.stdout.moveCursor(0, -2);
        if (this.lastCons) {
            this.lastCons.abort();
            process.stdout.moveCursor(-process.stdout.getWindowSize()[0], 0);
        }
        if (this.isShuttingDown)
            process.stdout.moveCursor(-process.stdout.getWindowSize()[0], 1);
        return time;
    }
    printer(message, placeholders, type, color) {
        let interval = setInterval(() => {
            if (this.inUse)
                return;
            this.inUse = true;
            let multiline = message.includes("\n");
            message = new String(message).toString();
            for (let string of message.split("\n")) {
                let parsedMessage = super.parse(string, placeholders);
                let time = this.prelog(type, parsedMessage);
                terminal_kit_1.terminal[color](`[${time} ${type}] ${parsedMessage}`);
                this.bot.emit(`core.logger.${type.toLowerCase()}`, parsedMessage);
                if (multiline)
                    process.stdout.moveCursor(0, 1);
            }
            if (multiline)
                process.stdout.moveCursor(0, -1);
            clearInterval(interval);
            this.rearm();
            this.inUse = false;
        }, 10);
    }
    log(message, placeholders) {
        this.printer(message, placeholders, "INFO", "white");
    }
    warn(message, placeholders) {
        this.printer(message, placeholders, "WARN", "yellow");
    }
    error(message, placeholders) {
        this.printer(message, placeholders, "ERROR", "red");
    }
    grave(message, placeholders) {
        this.printer(message, placeholders, "GRAVE", "red");
    }
    ml(message, placeholders) {
        this.printer(message, placeholders, "ModuleLoader", "brightGreen");
    }
    pl(message, placeholders) {
        this.printer(message, placeholders, "PluginLoader", "brightGreen");
    }
    mu(message, placeholders) {
        this.printer(message, placeholders, "ModuleUnloader", "brightRed");
    }
    pu(message, placeholders) {
        this.printer(message, placeholders, "PluginUnloader", "brightRed");
    }
    fatal(message, placeholders) {
        message = new String(message).toString();
        for (let i in message.split("\n")) {
            let parsedMessage = super.parse(message.split("\n")[i], placeholders);
            terminal_kit_1.terminal.bgRed(`\n[FATAL] ${parsedMessage}`);
        }
        setTimeout(() => {
            this.bot.stop();
        }, 500);
    }
    debug(message, placeholders) {
        if (this.bot.config.core.debug)
            this.printer(message, placeholders, "DEBUG", "brightBlue");
    }
    rearm() {
        if (this.lastCons) {
            this.lastCons.abort();
        }
        if (this.isShuttingDown)
            return;
        this.cons();
    }
}
exports.default = Logger;
