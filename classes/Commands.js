const fs = require('fs');
const Console = require("./Console")
let Commands = {
  /**
   * Stop the bot
   * @param {Console} console 
   */
  stop(console) {
    // Should unload all plugins, then modules and soft-stop the bot
    console.log(console.bot.lang.commands.shutdown_message);
    process.stdout.clearLine();
    console.term.processExit(0);
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
  help(console) {
    console.log("Not completed yet!");
  },
  reloadLang(console) {
    console.log(console.bot.lang.commands.reloadLang_start);
    console.bot.reloadLang();
    console.log(console.bot.lang.commands.reloadLang_finish);
  }
}

module.exports = {
  Commands
}