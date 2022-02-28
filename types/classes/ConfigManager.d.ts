import ChairWoom from "./ChairWoom";
export declare class ConfigManager {
    config: Object;
    bot: ChairWoom;
    /**
     * Initialize a new instance of the ConfigManager
     * @param bot The ChairBot instance that called it
     * @param callback Returns when the configs are ready
     * @returns The ConfigManager
     */
    constructor(bot: ChairWoom, callback: Function);
    /**
     * Load all configs from the config folder
     * @returns A promise with the config
     */
    loadConfig(): Promise<unknown>;
    /**
     * Reloads configs in the bot
     */
    reloadConfig(): void;
    /**
     * Unloads a specific config from the bot
     * @param name The config name
     */
    unloadConfig(name: string): void;
}
