const Console = require("./classes/Console");
const CharBot = require("./classes/CharBot");
const Logger = require("./classes/Logger");
const PlaceHolders = require("./classes/PlaceHolders");
const fs = require('fs');

try {
  const bot = new CharBot();
  bot.on("ready", () => {
    bot.logger.log("READY");
  });
} catch (e) {
  fs.writeFileSync("logs/error.log", e.toString(), {encoding: "utf8"});
}

module.exports = {
  CharBot,
  Logger,
  Console,
  PlaceHolders
};
