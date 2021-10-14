const Logger = require("./Logger");
const Base = require("./Base");
const Console = require("./Console");
var version = "0.1-ALPHA";

class CharBot {
  constructor() {
//    this.bot = bot;
    //this.commands();
    this.logger = new Logger(console);
    this.logger.log(`Starting CharBot v${version}...`);
    process.on("SIGINT", (signal) => {
      process.stdout.write("\n");
      this.logger.log("Shutting down...");
      process.stdout.clearLine();
      process.exit(0);
    });
    this.console = new Console({command: () => {this.logger.warn("command triggered")}});
    return this;
  }

  commands() {

  }
}
module.exports = CharBot;
