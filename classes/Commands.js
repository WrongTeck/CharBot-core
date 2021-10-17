const fs = require('fs');
const Console = require("./Console")
let Commands = {
  /**
   * Stop the bot
   * @param {Console} console 
   */
  stop(console) {
    // Should unload all plugins, then modules and soft-stop the bot
    console.log("Shutting down...\nBye!");
    process.stdout.clearLine();
    console.term.processExit(0);
  },
  /**
   * Clear all logs
   * @param {Console} console 
   */
  clearLogs(console) {
    fs.readdir("./logs", { encoding: "utf-8" }, (err, files) => {
      if (err) return console.error("Unable to delete logs!");
      files.forEach((value, index, array) => {
        fs.rm("./logs/"+value, { force: true }, () => {});
      });
    });
    console.log("Cleared Logs!");
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
    console.log("Reloading commands...");
    console.unregisterCommand();
    console.registerCommand(require("./Commands").Commands);
    // Here we should call the bot instance to load again all modules and plugins commands
  },
  /**
   * Show what commands are registered in the bot
   * @param {Console} console 
   */
  registeredCommands(console) {
    console.log(Object.keys(console.commands));
  }
}
module.exports = {
  Commands
}