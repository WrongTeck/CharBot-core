import { readdir, rm } from "fs";
import ChairConsole from "./Console";

export let BasicCommands = {
  /**
   * Strops the bot from the console
   * @param console The console
   */
  stop(console: ChairConsole) {
    console.bot.stop();
  },
  /**
   * Alias for stop
   * @param console The console
   */
  exit(console: ChairConsole) {
    console.commands.stop(console);
  },
  /**
   * Clear the logs folder
   * @param c The console
   */
  clearLogs(c: ChairConsole) {
    readdir("./logs", { encoding: "utf-8" }, (err, files) => {
      if (err) return c.error(c.bot.lang.files.core.commands.clear_logs_error);
      files.forEach((value) => {
        rm("./logs/"+value, { force: true }, (err1) => {
          if (err1) return c.error(c.bot.lang.files.core.commands.clear_logs_fail);
        });
      });
    });
    c.log(c.bot.lang.files.core.commands.clear_logs_success);
  },
  /**
   * Show all commands typed
   */
  history(c: ChairConsole) {
    c.log(c.history.toString());
  },
  /**
   * Show what commands are registered in the bot
   */
  commands(c: ChairConsole) {
    c.log(Object.keys(c.commands).toString());
  },
  /**
   * Print a quick help
   */
  help(console: ChairConsole) {
    console.log("Commands list:");
    setTimeout(() => {
      console.lastCons.abort();
      process.stdout.moveCursor(-2, 0);
      console.term.table([
        ['COMMAND','DESCRIPTION'],
        ['^Y clearLogs','Deletes the Chairbot\' log files'],
        ['^Y exit','Alias for "stop" command'],
        ['^Y help','Shows this table about commands'],
        ['^Y history',''],
        ['^Y reloadCommands',''],
        ['^Y reloadLang','Reloads the localization files'],
        ['^Y stop','Stops the bot'],
      ],
      {
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
  /**
   * Reload all, modules, plugins or the lang files
   * @param c The console
   * @param args Arguments of the command
   */
  reload(c: ChairConsole, args: string[]) {
    if(args.length == 0)
      return c.log(c.bot.lang.files.core.commands.reload_help);
    switch(args[1]) {
      case "commands":
        c.log(c.bot.lang.files.core.commands.reload_commands);
        c.unregisterCommand();
        c.registerCommand();
        break;
      case "lang":
        c.log(c.bot.lang.files.core.reloadLang_start);
        for(const name in c.bot.lang.files) {
          if(name == "core") {
            c.bot.lang.setLang(c.bot.cm.config.core.lang);
            continue;
          }
          let type: string = c.bot.lang.files[name].type;
          c.bot.lang.unloadLang(name);
          c.bot.lang.loadLang(type, name);
        }
        c.log(c.bot.lang.files.core.reloadLang_finish);
        break;
      case "config":
        c.bot.cm.reloadConfig();
        c.log("Reloaded Configs!");
        break;
      default:
        c.error("Unknown sub-command {arg}", {arg: args[1]});
    }
  },
  /**
   * Clear the stdout
   */
  clear(console: ChairConsole) {
    console.term.clear();
    console.log("Cleared!");
  },
  /**
   * With this command you can manage all repository related things
   * @param console The console
   * @param args The arguments if any
   */
  repo(console: ChairConsole, args: string[]) {
    if(args.length == 0) {
      return console.log("Print the help message");
    }
    switch(args[1]) {
      case "upgrade":
        console.bot.repo.upgrade(args[2], args[3]);
        break;
      default:
        console.log("Invalid subcommand!");
    }
  },
  plugins(c: ChairConsole) {
    c.log(Object.keys(c.bot.pm.plugins).toString())
  },
  configs(c: ChairConsole) {
    console.dir(c.bot.cm.config.core);
    c.rearm();
  }
}

export default BasicCommands;