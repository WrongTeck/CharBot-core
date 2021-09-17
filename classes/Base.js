const EventEmitter = require('events');

class Base {
    constructor(bot, data) {
      if(bot) {
          if(data !== null && typeof data == "object") {
              Object.assign(this, data);
          }
          return;
      }
      this.event = new EventEmitter();
      if(data !== null && typeof data == "object") {
        Object.assign(this, data);
      }
      this.on = this.event.on;
      this.modules = {};
      this.plugins = {};
      return this;
    }
  }