const EventEmitter = require('events');
const event = new EventEmitter();
const process = require('process');

class Base {
  constructor(bot) {
    if(bot) return;
  }
}

class BasePlugin extends Base {
  constructor (plugin, bot) {
    super(bot);
    if (!plugin.config) {
      return bot.logger('err1', `An error occured while loading a plugin!`);
    }
  }
}

class Bot extends Base{
  constructor(params) {
    super();
    Object.defineProperty(this, "plugins", { value: {}, writable: true });
  }
}

module.exports = {
  Bot,
  BasePlugin
};
event.on('ok',console.log)

event.emit('ok', "Ciao");
