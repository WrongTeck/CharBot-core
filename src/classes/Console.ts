import { Logger } from "./Logger";
import { terminal } from "terminal-kit";
import CharBot from "./CharBot";
const term = terminal;
import { Commands, BasicCommands } from "./Commands";

export class CharConsole extends Logger {
  lastCommand: string;
  bot: CharBot;
  term: any;
  commands: Commands;
  constructor(charbot: CharBot) {
    super();
    super.executor = this.command;
    this.bot = charbot;
    this.commands = {};
    Object.assign(this.commands, BasicCommands);
    this.history = [];
    this.lastCommand = "";
    this.term = term;
    term.grabInput(true);
    term.fullscreen(true);
    term.on("key", (name: string, matches, data) => {
      this.character(name);
    });
  }
  character(name: string) {
    if(name.startsWith("CTRL") && name != "CTRL_C") return;
    let admitted = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_'];
    if(admitted.includes(name)) return;
    if(name == "CTRL_C") {
        try {
          this.commands.stop(this);
        } catch (e) {
          this.fatal("Something is broken! Hard exit...");
          process.exit(1);
        }
    }
  }
  command(last: string) {
    if(!last) return this.enter();
    if(last.includes(" ")) {
      this.addHistory(last);
      if(!Object.keys(this.commands).includes(last.split(" ")[0])) {
        return this.error(this.bot.lang.commands.invalid_command, { command: last.split(" ")[0] });
      }
      Object.values(this.commands)[Object.keys(this.commands).indexOf(last.split(" ")[0])](this, last.split(" "));
    } else {
      this.addHistory(last);
      if(!Object.keys(this.commands).includes(last)) {
        return this.error(this.bot.lang.commands.invalid_command, { command: last.split(" ")[0] });
      } else if(typeof Object.values(this.commands)[Object.keys(this.commands).indexOf(last)] == "function") {
        Object.values(this.commands)[Object.keys(this.commands).indexOf(last)](this);
      }
    }
  }
  enter() {
    term.inputField({
      echo: true,
      autoCompleteHint: true,
      autoComplete: Object.keys(this.commands),
      history: this.history
    }, (err, arg) => {
      if(err) return this.error(err);
      this.executor(arg);
    });
  }
  unregisterCommand(name?: string) {
    if(name) {
      delete this.commands[name];
    } else {
      delete this.commands;
    }
    this.commands = {};
    Object.assign(this.commands, BasicCommands);
  }
  registerCommand(commands: Commands) {
    if(this.commands) {
      this.commands = Object.assign(this.commands, commands);
      super.commands = this.commands;
    } else {
      this.commands = commands;
      super.commands = this.commands;
    }
    Object.assign(this.commands, BasicCommands);
  }
}

export default CharConsole;