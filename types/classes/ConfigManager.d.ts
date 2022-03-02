import ChairWoom from "./ChairWoom";
export declare class ConfigManager {
    private bot;
    config: Object;
    constructor(bot: ChairWoom, callback: Function);
    loadConfig(): Promise<unknown>;
    reloadConfig(): void;
    unloadConfig(name: string): void;
}
