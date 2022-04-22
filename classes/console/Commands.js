"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicCommands = void 0;
const fs_1 = require("fs");
exports.BasicCommands = {
    stop(console) {
        console.bot.stop();
    },
    exit(console) {
        console.commands.stop(console);
    },
    clearLogs(c) {
        (0, fs_1.readdir)("./logs", { encoding: "utf-8" }, (err, files) => {
            if (err)
                return c.error(c.bot.lang.files.core.commands.clear_logs_error);
            files.forEach((value) => {
                (0, fs_1.rm)("./logs/" + value, { force: true }, (err1) => {
                    if (err1)
                        return c.error(c.bot.lang.files.core.commands.clear_logs_fail);
                });
            });
        });
        c.log(c.bot.lang.files.core.commands.clear_logs_success);
    },
    history(c) {
        console.log(c.history.toString());
    },
    commands(c) {
        console.log(Object.keys(c.commands));
    },
    help(console) {
        console.log("Commands list:");
        setTimeout(() => {
            console.lastCons.abort();
            process.stdout.moveCursor(-2, 0);
            console.term.table([
                ['COMMAND', 'DESCRIPTION'],
                ['^YclearLogs', 'Deletes the Chairbot\' log files'],
                ['^Yexit', 'Alias for "stop" command'],
                ['^Yhelp', 'Shows this table about commands'],
                ['^Yhistory', ''],
                ['^YreloadCommands', ''],
                ['^YreloadLang', 'Reloads the localization files'],
                ['^Ystop', 'Stops the bot'],
            ], {
                contentHasMarkup: true,
                firstRowTextAttr: { bgColor: 'white', color: 'black' },
                borderAttr: { color: 'yellow' },
                borderChairs: "heavy",
                width: 40,
                fit: true
            });
            console.rearm();
        }, 100);
    },
    reload(c, args) {
        if (args.length == 0)
            return c.log(c.bot.lang.files.core.commands.reload_help);
        switch (args[1]) {
            case "commands":
                c.log(c.bot.lang.files.core.commands.reload_commands);
                c.unregisterCommand();
                c.registerCommand(this);
                break;
            case "lang":
                c.log(c.bot.lang.files.core.reloadLang_start);
                for (const name in c.bot.lang.files) {
                    if (name == "core") {
                        c.bot.lang.setLang(this.bot.config.core.lang);
                        continue;
                    }
                    let type = c.bot.lang.files[name].type;
                    c.bot.lang.unloadLang(name);
                    c.bot.lang.loadLang(type, name);
                }
                c.log(c.bot.lang.files.core.reloadLang_finish);
                break;
            case "modules":
                break;
            default:
                c.error("Unknown command {arg}", { arg: args[0] });
        }
    },
    clear(console) {
        console.term.clear();
        console.log("Cleared!");
    },
    repo(console, args) {
        if (args.length == 0) {
            return console.log("Print the help message");
        }
        switch (args[1]) {
            case "upgrade":
                console.bot.repo.upgrade(args[2], args[3]);
                break;
            default:
                console.log("Invalid subcommand!");
        }
    }
};
exports.default = exports.BasicCommands;
