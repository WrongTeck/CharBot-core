import { readdir, rm } from "fs";
import CharConsole from "./Console";

export let BasicCommands = {
  /**
   * Strops the bot from the console
   * @param console The console
   */
  stop(console: CharConsole) {
    console.bot.stop();
  },
  /**
   * Alias for stop
   * @param console The console
   */
  exit(console: CharConsole) {
    console.commands.stop(console);
  },
  /**
   * Clear the logs folder
   * @param console The console
   */
  clearLogs(console: CharConsole) {
    readdir("./logs", { encoding: "utf-8" }, (err, files) => {
      if (err) return console.error(console.bot.lang.commands.clear_logs_error);
      files.forEach((value, index, array) => {
        rm("./logs/"+value, { force: true }, (err1) => {
          if (err1) return console.log("Cannot remove logs!");
        });
      });
    });
    console.log(console.bot.lang.commands.clear_logs_success);
  },
  /**
   * Show all commands typed
   */
  history(console: CharConsole) {
    console.log(console.history.toString());
  },
  /**
   * Show what commands are registered in the bot
   */
  commands(console) {
    console.log(Object.keys(console.commands));
  },
  /**
   * Print a quick help
   */
  help(console: CharConsole) {
    console.log("Commands list");
    console.lastCons.abort();
    console.term("\b\b"); // deletes '> ' char
    console.term.table([
      ['COMMAND','DESCRIPTION'],
      ['^YclearLogs','Deletes the Chairbot\' log files'],
      ['^Yexit','Alias for "stop" command'],
      ['^Yhelp','Shows this table about commands'],
      ['^Yhistory',''],
      ['^YreloadCommands',''],
      ['^YreloadLang','Reloads the localization files'],
      ['^Ystop','Stops the bot'],
    ],
    {
      contentHasMarkup: true,
      firstRowTextAttr: {bgColor: 'white', color: 'black'},
      borderAttr: {color: 'yellow'},
      borderChars: "heavy",
      width: 40,
      fit:true
    });
    console.rearm();
  },
  /**
   * Reload console commands
   */
  reloadLang(console: CharConsole) {
    console.log(console.bot.lang.commands.reloadLang_start);
    console.bot.reloadLang();
    console.log(console.bot.lang.commands.reloadLang_finish);
  },
  /**
   * Clear the stdout
   */
  clear(console: CharConsole) {
    console.term.clear();
    console.log("Cleared!");
  },
  /**
   * Reload all commands in CharBot
   * @param console The console
   */
  reloadCommands(console: CharConsole) {
    console.log(console.bot.lang.commands.reload_commands);
    console.unregisterCommand();
    console.registerCommand(this);
  },
}

export default BasicCommands;