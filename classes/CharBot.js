const version = "0.1-ALPHA";
const Console = require("./Console");
const EventEmitter = require("events");

class CharBot extends EventEmitter {
  constructor() {
    super({captureRejections: true});
    this.console = new Console(require("./Commands").Commands, this);
    this.console.log("Starting CharBot v"+version);
    this.emit("ready");
    return this;
  }
}
module.exports = CharBot;
