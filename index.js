const BaseModule = require('./classes/BaseModule');
const CharBot = require('./classes/CharBot');
const BasePlugin = require('./classes/BasePlugin');
const Logger = require("./classes/Logger");
const Base = require("./classes/Base");
let bot = new CharBot();

module.exports = {
    BaseModule,
    CharBot,
    BasePlugin,
    Logger,
    Base
};
