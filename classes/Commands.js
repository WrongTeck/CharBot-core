const fs = require('fs');
const term = require('terminal-kit').terminal;
const Console = require("./Console")
let Commands = {
  /**
   * Stop the bot
   * @param {Console} console 
   */
  stop(console) {
    // Should unload all plugins, then modules and soft-stop the bot
    console.log(console.bot.lang.commands.shutdown_message);
    console.log("Bye!");
    process.stdout.clearLine();
    console.term.processExit(0);
  },
  /**
   * Alias for stop 
   * @param {Console} console The console
   */
  exit(console) {
    console.commands.stop(console);
  },
  /**
   * Clear all logs
   * @param {Console} console
   */
  clearLogs(console) {
    fs.readdir("./logs", { encoding: "utf-8" }, (err, files) => {
      if (err) return console.error(console.bot.lang.commands.clear_logs_error);
      files.forEach((value, index, array) => {
        fs.rm("./logs/"+value, { force: true }, (err1) => {
          if (err1) return console.log("Cannot remove logs!");
        });
      });
    });
    console.log(console.bot.lang.commands.clear_logs_success);
  },
  /**
   * Show all commands typed
   * @param {Console} console 
   */
  history(console) {
    console.log(console.history.toString());
  },
  /**
   * Reload console commands
   * @param {Console} console 
   */
  reloadCommands(console) {
    console.log(console.bot.lang.commands.reload_commands);
    console.unregisterCommand();
    console.registerCommand(require("./Commands").Commands);
    // Here we should call the bot instance to load again all modules and plugins commands
  },
  /**
   * Show what commands are registered in the bot
   * @param {Console} console 
   */
  commands(console) {
    console.log(Object.keys(console.commands));
  },
  /**
   * Print a quick help
   * @param {Console} console The console
   */
  help(console) {
    console.log("Commands list");
    console.lastcons.abort();
    term("\b\b"); // deletes '>' char
    term.table([
      ['COMMAND','DESCRIPTION'],
      ['^YclearLogs','Deletes the Chairbot\' log files'],
      ['^Yexit','Alias for "stop" command'],
      ['^Yhelp','Shows this table about commands'],
      ['^Yhistory',''],
      ['^YreloadCommands',''],
      ['^YreloadLang','Reloads the localization files'],
      ['^Ystop','Should unload all plugins,\nthen modules and soft-stop the bot'],
    ],
    {
      //textAttr: {bgColor: 'black'},
      contentHasMarkup: true,
      firstRowTextAttr: {bgColor: 'white', color: 'black'},
      borderAttr: {color: 'yellow'},
      borderChars: "heavy",
      width: 40,
      fit:true});
    console.cons();
    term("> "); // adds '>' char
  },
  /**
   * Reload console commands
   * @param {Console} console The console
   */
  reloadLang(console) {
    console.log(console.bot.lang.commands.reloadLang_start);
    console.bot.reloadLang();
    console.log(console.bot.lang.commands.reloadLang_finish);
  }
}

module.exports = {
  Commands
}