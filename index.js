const BaseModule = require("./classes/BaseModule");
const CharBot = require("./classes/CharBot");
const BasePlugin = require("./classes/BasePlugin");
const Logger = require("./classes/Logger");
const Base = require("./classes/Base");
const fs = require('fs');

try {
  new CharBot();
} catch (e) {
  fs.writeFileSync("logs/error.log", e, {encoding: "utf8"});
}

module.exports = {
  BaseModule,
  CharBot,
  BasePlugin,
  Logger,
  Base,
};
