import ChairWoom from "../ChairWoom";

export default class Upgrade {
  constructor(private bot: ChairWoom) {
    return this;
  }
  /**
   * Upgrade a specific package, given the name and the type
   * @param name Name of the package
   * @param type Type of the package
   */
  public package(name: string, type: "core" | "plugin") {
    //PlaceHolder
  }

  /**
   * Upgrade all the packages given the type, if given
   * Else upgrade all core packages and plugins
   * @param type The type os the packages
   */ 
  public upgradeAll(type?: "core" | "plugin") {
    //PlaceHolder
  }
}