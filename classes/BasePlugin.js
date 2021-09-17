class BasePlugin extends Base {
    constructor(name, module, bot) {
      let data = {};
      Object.defineProperty(data, name, {writable: false, value: module});
      super(bot, data);
    }
  }