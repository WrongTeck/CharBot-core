import { ChairConsole } from ".";
export interface Configs {
    [confName: string]: Configs & string;
}
export interface Lang {
    [langName: string]: Lang & string;
}
export interface Command {
    (console: ChairConsole, args?: Array<string>): void;
}
export interface Commands {
    [propName: string]: Command;
}
export interface ChairModule {
    name: string;
    version: string;
    modules?: Array<string>;
    main?: any;
    commands?: Commands;
    [name: string]: any;
}
export interface ChairModules {
    [moduleName: string]: ChairModule;
}
export interface PlaceHolder {
    [propName: string]: any;
}
export interface ChairPlugin {
    name: string;
    version: string;
    modules?: Array<string>;
    main?: any;
    commands?: Commands;
    [property: string]: any;
}
export interface ChairPlugins {
    [pluginName: string]: ChairPlugin;
}
