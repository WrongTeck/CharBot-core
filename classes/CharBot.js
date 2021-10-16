const Logger = require("./Logger");
const Base = require("./Base");
const Console = require("./Console");
var version = "0.1-ALPHA";
const EventEmitter = require("events");

class CharBot extends EventEmitter {
  constructor() {
    super({captureRejections: true});
    this.console = new Console({command: () => {this.console.warn("command triggered")}, stop: ()=> {process.exit()}});
    this.console.log("Starting CharBot v"+version);
    this.emit("ready");
    return this;
  }

  commands() {

  }
}
module.exports = CharBot;
