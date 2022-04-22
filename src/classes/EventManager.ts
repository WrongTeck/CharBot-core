import { ChairWoom } from "./ChairWoom";

interface RegisteredEventsOP {
  [pluginName: string]: {
    [eventName: string]: number;
  };
}

interface ListenerNumberOP {
  [eventName: string]: number;
}

interface PluginsEvents {
  [plugin: string]: string[]
}

export default class EventManager {
  /**
   * If the eventManager is processing some register
   */
  private inUse: boolean = false;
  /**
   * Whatever or not if the EventManager has finished booting up
   */
  private notInitialized: boolean = true;
  /**
   * Registered Listeners in the EventManager
   */
  private registeredListeners: RegisteredEventsOP;
  /**
   * Listeners for every event
   */
  private listenersNumber: ListenerNumberOP;
  /**
   * Contains a list of all plugins with the events
   */
  registeredPluginsEvents: PluginsEvents;
  /**
   * Initialize a new EventManager
   * @param bot The ChairWoom instance
   * @returns The EventManager
   */
  constructor(private bot: ChairWoom) {
    this.registeredListeners = {};
    this.listenersNumber = {};
    this.registeredPluginsEvents = {};
    return this;
  }
  /**
   * A good description is needed
   * @param source The plugin requesting the event manager
   * @param eventName The plugin from which receiving the events
   */
  public addEventListener(name: string, eventName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        // Checks that is not already in use and that the EventManager is initialized
        if (this.inUse || this.notInitialized) return;
        this.inUse = true;
        // Registered listeners for a plugin
        if(!this.registeredListeners[name])
          this.registeredListeners[name] = {};
        
        if(!this.listenersNumber[eventName])
          this.listenersNumber[eventName] = -1;
        // Checks that a plugin is not begin registered twice
        if(typeof this.registeredListeners[name][eventName] != "undefined") {
          reject();
          clearInterval(interval);
          this.bot.console.grave("An attempt was made to log the same event twice. Event: {eventName} Name: {name}", {name, eventName});
          return;
        }
        // Checks that the array for the events names of a plugin is initialized
        if(typeof this.registeredPluginsEvents[name] != "object")
          this.registeredPluginsEvents[name] = [];
        // Append the event name to the list of the events registered by a plugin
        this.registeredPluginsEvents[name].push(eventName);
        // Sets the event number in the ones registered
        this.registeredListeners[name][eventName] = ++this.listenersNumber[eventName];
        clearInterval(interval);
        resolve();
        this.inUse = false;
      }, 10);
    });
  }

  /**
   * Remove a specific event listener given the 
   * plugin/module name and the event name
   * @param name Plugin name
   * @param eventName The event name
   */
  public removeEventListener(name: string, eventName: string) {
    // Fetch the function from the one registered
    let functionListener = this.bot.listeners(eventName)[this.registeredListeners[name][eventName]];
    // Removes the function from the events
    this.bot.removeListener(eventName, functionListener);
    this.registeredPluginsEvents[name].splice(this.registeredPluginsEvents[name].indexOf(eventName), 1);
    delete this.registeredListeners[name][eventName];
  }

  /**
   * Register already logged listeners
   */
  public registerEvents() {
    if(!this.notInitialized) return;
    for (const name in this.bot.eventNames()) {
      this.listenersNumber[name] = this.bot.listenerCount(name);
    }
    this.notInitialized = false;
  }
}
