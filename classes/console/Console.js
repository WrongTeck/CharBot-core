"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChairConsole = void 0;
const Logger_1 = __importDefault(require("./Logger"));
const terminal_kit_1 = require("terminal-kit");
const term = terminal_kit_1.terminal;
class ChairConsole extends Logger_1.default {
    constructor(bot) {
        super(bot);
        this.bot = bot;
        this.stops = 0;
        super.executor = this.command;
        this.commands = {};
        this.registerCommand({});
        this.history = [];
        this.lastCommand = "";
        this.term = term;
        this.term.grabInput({
            mouse: "button",
            safe: false
        });
        this.term.on("key", (name) => {
            switch (name) {
                case "BACKSPACE":
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                    break;
                case "CTRL_C":
                    console.log("\n");
                    try {
                        this.bot.stop();
                    }
                    catch (e) {
                        this.fatal("Something is broken!");
                        process.exit(1);
                    }
                    break;
                case "ENTER":
                    this.buffer = "";
                    break;
                default:
                    if (name.match("^[a-zA-Z0-9]$"))
                        this.buffer = this.buffer.concat(name);
                    break;
            }
        });
    }
    command(last) {
        if (!last)
            return this.enter();
        if (last.includes(" ")) {
            this.addHistory(last);
            if (!Object.keys(this.commands).includes(last.split(" ")[0])) {
                return this.error(this.bot.lang.files.core.commands.invalid_command, {
                    command: last.split(" ")[0],
                });
            }
            Object.values(this.commands)[Object.keys(this.commands).indexOf(last.split(" ")[0])](this, last.split(" "));
        }
        else {
            this.addHistory(last);
            if (!Object.keys(this.commands).includes(last)) {
                return this.error(this.bot.lang.files.core.commands.invalid_command, {
                    command: last.split(" ")[0],
                });
            }
            else if (typeof Object.values(this.commands)[Object.keys(this.commands).indexOf(last)] == "function") {
                Object.values(this.commands)[Object.keys(this.commands).indexOf(last)](this, []);
            }
        }
    }
    enter() {
        process.stdout.moveCursor(-process.stdout.getWindowSize()[0], -2);
        this.rearm();
    }
    unregisterCommand(name) {
        this.bot.emit("core.console.unregister", name);
        if (name) {
            delete this.commands[name];
        }
        else {
            delete this.commands;
        }
        this.commands = {};
        const { BasicCommands } = require("./Commands");
        Object.assign(this.commands, BasicCommands);
    }
    registerCommand(commands) {
        this.bot.emit("core.console.register", Object.keys(commands));
        if (this.commands) {
            this.commands = Object.assign(this.commands, commands);
            super.commands = this.commands;
        }
        else {
            this.commands = commands;
            super.commands = this.commands;
        }
        const { BasicCommands } = require("./Commands");
        Object.assign(this.commands, BasicCommands);
    }
}
exports.ChairConsole = ChairConsole;
exports.default = ChairConsole;
