import CharBot from "./CharBot";
export declare class ConfigLoader {
    config: Object;
    bot: CharBot;
    constructor(bot: CharBot, callback: Function);
    loadConfig(): Promise<unknown>;
    reloadConfig(): void;
    unloadConfig(name: any): void;
}
