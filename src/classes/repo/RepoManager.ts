import { ChairWoom } from "../ChairWoom";
import axios from "axios";
import { stat, mkdir, writeFile, readFile, readdir } from "fs";
import { HashUpdate } from "../../interfaces";
import { createHash } from "crypto";

export default class RepoManager {
  /**
   * Initialize a new instance of the Repository Manager
   * @param bot The ChairWoom instance
   * @returns The repository manager
   */
  constructor(private bot: ChairWoom) {
    stat("./cache", (err) => {
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
    readFile("./cache/plugins.hash", { encoding: "base64" }, (err, data) => {
      if(err)
        hashes.plugins = "";
      hashes.plugins = data;
    });
    readFile("./cache/core.hash", { encoding: "base64" }, (err, data) => {
      if(err)
        hashes.core = "";
      hashes.core = data;
    });
    axios.get(this.bot.config.core.repo.url + "/updates").then((value) => {
      let data: HashUpdate = JSON.parse(value.data);
      if(hashes.plugins != data.plugins)
        this.fetchPlugins();
      if(hashes.core != data.core)
        this.fetchCore();
    }).catch((err) => {
      this.bot.console.error("Error while fetching the repositories! Error:\n"+err);
    });
  }

  /**
   * Fetch plugins updates
   */
  public fetchPlugins() {
    this.fetchUpdate("plugins");
  }

  /**
   * Fetch core updates
   */
  public fetchCore() {
    this.fetchUpdate("core");
  }
  /**
   * Fetch the updates for a specific path
   * @param name The path
   */
  private fetchUpdate(name: "core" | "plugins") {
    axios.get(this.bot.config.core.repo.url + `/${name}`).then((res) => {
      writeFile(`./cache/${name}.json`, res.data, (err) => {
        if(err)
          this.bot.console.error(this.bot.lang.files.core.repo.error_write, { name });
      });
      writeFile(`./cache/${name}.hash`, createHash("sha256").update(res.data).digest("base64"), (err) => {
        if(err)
          this.bot.console.error(this.bot.lang.files.core.repo.error_write, { name: `${name} hash` });
      });
    }).catch((reason) => {
      this.bot.console.error(this.bot.lang.files.core.repo.error, {name, e: reason});
    });
  }

  /**
   * Upgrade a single package or all packages based on the given options
   * @param type The type to upgrade
   * @param name Name of the package to update
   * @param version Specific version to upgrade/downgrade
   */
  public upgrade(type: "plugins" | "core" | "all" | string, name?: string) {
    switch(type) {
      case "all":
          if(name)
            this.bot.console.log(this.bot.lang.files.core.repo.upgrade.all_name_ignored);
          
        break;

      case "plugins":

        break;

      case "core":

        break;
      
      default:
        this.bot.console.error(this.bot.lang.files.core.repo.upgrade.invalid_type, { type });
        break;
    }
  }

  /**
   * 
   */
  private pollPlugins() {
    let installed = [];
    readdir("./plugins", { encoding: "utf-8", withFileTypes: true }, (err, data) => {
      if(err)
        return;
      data.forEach((value) => {
        if(!value.isDirectory())
          return;
        try {
          let load = require(`./plugins/${value.name}/index.js`);
          installed.push({
            name: load.name,
            version: load.version
          });
        } catch (e) {
          this.bot.console.debug("Error while loading {name}", {name: value.name});
        }
      });
      writeFile("./cache/installed.json", JSON.stringify(installed), (err) => {
        if(err)
          return;
      }); 
    });
  }
}