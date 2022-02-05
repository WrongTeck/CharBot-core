import { CharConsole } from ".";

export interface Configs {
  [confName: string]: Configs & string,
}

export interface Lang {
  [langName: string]: Lang & string
}

export interface Command {
  (console: CharConsole, args?: Array<string>): void
}

export interface Commands {
  [propName: string]: Command
}

export interface CharModule {
  name: string;
  version: string;
  modules?: Array<string>;
  main?: any;
  commands?: Commands;
  [name: string]: any
}

export interface CharModules {
  [moduleName: string]: CharModule;
}

export interface PlaceHolder {
  [propName: string]: any
}

export interface CharPlugin {
  name: string;
  version: string;
  modules?: Array<string>;
  main?: any;
  commands?: Commands;
  [property: string]: any;
}

export interface CharPlugins {
  [pluginName: string]: CharPlugin;
}
