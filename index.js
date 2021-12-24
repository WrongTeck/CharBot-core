const Console = require("./classes/Console");
const CharBot = require("./classes/CharBot");
const Logger = require("./classes/Logger");
const PlaceHolders = require("./classes/PlaceHolders");
const ModuleLoader = require("./classes/ModuleLoader");
const PluginLoader = require("./classes/PluginLoader");


try {
  const bot = new CharBot();
  bot.on("loadingConfig", () => {
    this.bot.console.log("Loading config...");
  });
} catch (error) {
  console.error(error);
}

module.exports = {
  CharBot,
  Logger,
  Console,
  PlaceHolders,
  ModuleLoader,
  PluginLoader,
};
