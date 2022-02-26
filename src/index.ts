import ChairWoom from "./classes/ChairWoom";
import ChairConsole from "./classes/Console";
import Logger from "./classes/Logger";
import PlaceHolders from "./classes/PlaceHolders";
import ModuleLoader from "./classes/ModuleManager";
import PluginLoader from "./classes/PluginManager";
import { BasicCommands } from "./classes/Commands";
import { Command, Commands } from "./interfaces";

new ChairWoom().start();

export {
  ChairWoom,
  ChairConsole,
  PlaceHolders,
  Logger,
  PluginLoader,
  ModuleLoader,
  Command,
  Commands,
  BasicCommands,
}