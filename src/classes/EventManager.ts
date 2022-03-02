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
  inUse: boolean = false;
  notInitialized: boolean = true;
  registeredEvents: string[];
  registeredListeners: RegisteredEventsOP;
  listenersNumber: ListenerNumberOP;
  constructor(private bot: ChairWoom) {
    this.registeredListeners = {};
    this.listenersNumber = {};
    return this;
  }
  /**
   * A good description is needed
   * @param source The plugin/module requesting the event manager
   * @param eventName The module/plugin from which receiving the events
   */
  public addEventListener(name: string, eventName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        if (this.inUse || this.notInitialized) return;
        this.inUse = true;
        if(!this.registeredListeners[name])
          this.registeredListeners[name] = {};
        if(!this.listenersNumber[eventName])
          this.listenersNumber[eventName] = -1;
        if(typeof this.registeredListeners[name][eventName] != "undefined") {
          reject();
          clearInterval(interval);
          this.bot.console.grave("An attempt was made to log the same event twice. Event: {eventName} Name: {name}", {name, eventName});
          return;
        }
          
        this.registeredListeners[name][eventName] = ++this.listenersNumber[eventName];
        clearInterval(interval);
        resolve();
        this.inUse = false;
      }, 10);
    });
  }

  public removeEventListener(name: string, eventName: string) {
    this.bot.removeListener(eventName, this.bot.listeners(eventName)[this.registeredListeners[name][eventName]]);
    delete this.registeredListeners[name][eventName];
  }

  public registerEvents() {
    for (const name in this.bot.eventNames()) {
      this.listenersNumber[name] = this.bot.listenerCount(name);
    }
    this.notInitialized = false;
  }
}
