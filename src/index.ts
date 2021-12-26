import CharBot from "./classes/CharBot";
import CharConsole from "./classes/Console";
import Logger from "./classes/Logger";
import PlaceHolders from "./classes/PlaceHolders";
import ModuleLoader from "./classes/ModuleLoader";
import PluginLoader from "./classes/PluginLoader";

try {
  var bot = new CharBot();
} catch (error) {
  console.error(error);
}

export {
  CharBot,
  CharConsole,
  PlaceHolders,
  Logger,
  PluginLoader,
  ModuleLoader
}