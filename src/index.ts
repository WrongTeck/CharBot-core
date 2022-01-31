import CharBot from "./classes/CharBot";
import CharConsole from "./classes/Console";
import Logger from "./classes/Logger";
import PlaceHolders from "./classes/PlaceHolders";
import ModuleLoader from "./classes/ModuleManager";
import PluginLoader from "./classes/PluginManager";
import { Command, Commands, BasicCommands } from "./classes/Commands";

new CharBot().start();

export {
  CharBot,
  CharConsole,
  PlaceHolders,
  Logger,
  PluginLoader,
  ModuleLoader,
  Command,
  Commands,
  BasicCommands,
}