import { ChairWoom } from "..";
interface RegisteredEventsOP {
    [pluginName: string]: {
        [eventName: string]: number;
    };
}
interface ListenerNumberOP {
    [eventName: string]: number;
}
export default class EventManager {
    private bot;
    inUse: boolean;
    notInitialized: boolean;
    registeredListeners: RegisteredEventsOP;
    listenersNumber: ListenerNumberOP;
    constructor(bot: ChairWoom);
    addEventListener(name: string, eventName: string): Promise<void>;
    removeEventListener(name: string, eventName: string): void;
    registerEvents(): void;
}
export {};
