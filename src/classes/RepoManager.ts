import { ChairWoom } from "..";
import axios from "axios";
import { stat, mkdir, writeFile, readFile } from "fs";
import { HashUpdate } from "../interfaces";
import crypto from "crypto";

export default class RepoManager {
  /**
   * Initialize a new instance of the Repository Manager
   * @param bot The ChairWoom instance
   * @returns The repository manager
   */
  constructor(private bot: ChairWoom) {
    stat("./cache", (err, stats) => {
      if(err)
        mkdir("./cache", (e) => {
          console.log(e);
        });
    });
    return this;
  }

  /**
   * Get all updates
   */
  public getUpdates() {
    let hashes: Partial<HashUpdate> = {};
    readFile("./cache/modules.json", (err, data) => {
      if(err)
        hashes.modules = "";
      hashes.modules = crypto.createHash("sha256").update(data).digest("hex");
    });
    readFile("./cache/plugins.json", (err, data) => {
      if(err)
        hashes.plugins = "";
      hashes.plugins = crypto.createHash("sha256").update(data).digest("hex");
    });
    readFile("./cache/core.json", (err, data) => {
      if(err)
        hashes.core = "";
      hashes.core = crypto.createHash("sha256").update(data).digest("hex");
    });
    axios.get(this.bot.config.core.repo.url + "/updates").then((value) => {
      let data: HashUpdate = JSON.parse(value.data);
      if(hashes.modules != data.modules)
        this.fetchModules();
      if(hashes.plugins != data.plugins)
        this.fetchPlugins();
      if(hashes.core != data.core)
        this.fetchCore();
    }).catch((err) => {
      this.bot.console.error("Error while fetching the repositories! Error:\n"+err);
    })
  }


  /**
   * Fetch module updates
   */
  public fetchModules() {
    axios.get(this.bot.config.core.repo.url + "/modules").then((res) => {
      writeFile("./cache/modules.json", res.data, (err) => {
        if(err)
          this.bot.console.error(this.bot.lang.files.core.repo.error_write, { name: "modules" });
      });
    }).catch((reason) => {
      this.bot.console.error(this.bot.lang.files.core.repo.error, {name: "modules", e: reason});
    });
  }

  /**
   * Fetch plugins updates
   */
  public fetchPlugins() {
    axios.get(this.bot.config.core.repo.url + "/plugins").then((res) => {
      writeFile("./cache/modules.json", res.data, (err) => {
        if(err)
          this.bot.console.error(this.bot.lang.files.core.repo.error_write, { name: "plugins" });
      });
    }).catch((reason) => {
      this.bot.console.error(this.bot.lang.files.core.repo.error, {name: "plugins", e: reason});
    });
  }

  /**
   * Fetch core updates
   */
  public fetchCore() {
    axios.get(this.bot.config.core.repo.url + "/core").then((res) => {
      writeFile("./cache/core.json", res.data, (err) => {
        if(err)
          this.bot.console.error(this.bot.lang.files.core.repo.error_write, { name: "core" });
      });
    }).catch((reason) => {
      this.bot.console.error(this.bot.lang.files.core.repo.error, {name: "core", e: reason});
    });
  }

  /**
   * Upgrade a single package or all packages based on the given options
   * @param type The type to upgrade
   * @param name Name of the package to update
   * @param version Specific version to upgrade/downgrade
   */
  public upgrade(type: "modules" | "plugins" | "core" | "all" | string, name?: string, version?: string) {
    switch(type) {
      case "all":
          
        break;
      
      case "modules":

        break;

      case "plugins":

        break;

      case "core":

        break;
      
      default:
        this.bot.console.error(this.bot.lang.files.core.repo.upgrade.invalid_type, {type});
        break;
    }
  }
}