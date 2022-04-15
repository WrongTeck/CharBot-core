import { Configs } from "../interfaces";
import ChairWoom from "./ChairWoom";
export declare class ConfigManager {
    private bot;
    config: Configs;
    constructor(bot: ChairWoom, callback: Function);
    loadConfig(): Promise<unknown>;
    reloadConfig(): void;
    unloadConfig(name: string): void;
}
