import { ChairWoom } from "./ChairWoom";
interface PluginsEvents {
    [plugin: string]: string[];
}
export default class EventManager {
    private bot;
    private inUse;
    private notInitialized;
    private registeredListeners;
    private listenersNumber;
    registeredPluginsEvents: PluginsEvents;
    constructor(bot: ChairWoom);
    addEventListener(name: string, eventName: string): Promise<void>;
    removeEventListener(name: string, eventName: string): void;
    registerEvents(): void;
}
export {};
