import { EventEmitter2 } from "eventemitter2";
import { ConfigManager } from "./ConfigManager";
import ChairConsole from "./Console";
import PluginManager from "./PluginManager";
import { Configs } from "../interfaces";
import RepoManager from "./RepoManager";
import EventManager from "./EventManager";
import LangManager from "./LangManager";
const version = "0.1 - ALPHA";

/**
 * The main class of ChairWoom were all begins
 */
export class ChairWoom extends EventEmitter2 {
  /**
   * The console to execute commands and print messages
   */
  console: ChairConsole;
  /**
   * The lang files
   */
  lang: LangManager;
  /**
   * The config files
   */
  config: Configs;
  /**
   * The PluginManager with its plugins
   */
  plugins: PluginManager;
  /**
   * The repo manager, to update, download and upgrade
   * modules, plugins and the core
   */
  repo: RepoManager;
  /**
   * The EventManager to manage all events in the bot
   */
  eventManager: EventManager;
  /**
   * Initialize a new ChairWoom instance
   * @returns The ChairWoom instance
   */
  constructor() {
    super({ wildcard: true });
    return this;
  }
  /**
   * Starts the bot
   */
  start(): ChairWoom {
    this.emit("core.start");
    this.console = new ChairConsole(this);
    this.eventManager = new EventManager(this);
    new ConfigManager(this, (config: Configs) => {
      this.config = config;
      this.lang = new LangManager(this);
      this.lang.setLang(this.config.core.lang).then(() => {
        this.console.log(this.lang.files.core.bot_banner_start, {version});
        this.plugins = new PluginManager(this);
      }).catch((err) => {
        this.console.fatal(err);
      })
    });

    this.on("core.plugins.finish", () => {
      this.repo = new RepoManager(this);
      this.emit("core.finish");
      this.eventManager.registerEvents();
      this.repo = new RepoManager(this);
      this.console.log(this.lang.files.core.done);
    });

    return this;
  }
  /**
   * Stops the bot
   */
  stop() {
    this.console.log(this.lang.files.core.commands.shutdown_message);
    this.emit("core.shutdown");
    for(let ChairPlugin in this.plugins.plugins) {
      this.plugins.unloadPlugin(ChairPlugin, false);
    }
    this.console.lastCons.abort();
    process.stdout.clearLine(0);
    process.stdout.clearLine(1);
    setTimeout(() => {
      this.console.term.clear();
      process.exit(0);
    }, 1500);
  }
}

export default ChairWoom;