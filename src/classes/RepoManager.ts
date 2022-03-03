import { ChairWoom } from "..";
import axios from "axios";
import { stat, mkdir, writeFile, readFile } from "fs";
import { HashUpdate } from "../interfaces";
import crypto from "crypto";

export default class RepoManager {
  constructor(private bot: ChairWoom) {
    stat("./cache", (err, stats) => {
      if(err)
        mkdir("./cache", (e) => {
          console.log(e);
        });
    });
    return this;
  }

  public getUpdates() {
    let hashes: Partial<HashUpdate> = {};
    readFile("./cache/modules.json", (err, data) => {
      if(err)
        hashes.modules = "";
      hashes.modules = crypto.createHash("sha256").update(data).digest("base64");
    });
    readFile("./cache/plugins.json", (err, data) => {
      if(err)
        hashes.plugins = "";
      hashes.plugins = crypto.createHash("sha256").update(data).digest("base64");
    });
    readFile("./cache/core.json", (err, data) => {
      if(err)
        hashes.core = "";
      hashes.core = crypto.createHash("sha256").update(data).digest("base64");
    });
    axios.get(this.bot.config.core.repo.url + "/updates").then((value) => {
      let data: HashUpdate = JSON.parse(value.data);
      let updated: boolean = true;
      if(hashes.modules != data.modules)
        this.fetchModules();
    }).catch((err) => {
      this.bot.console.error("Error while fetching the repositories! Error:\n"+err);
    })
  }

  public fetchModules() {
    axios.get(this.bot.config.core.repo.url + "/modules").then((res) => {
      writeFile("./cache/modules.json", res.data, (err) => {
        if(err)
          this.bot.console.error(this.bot.lang.repo.error_write, { name: "modules" });
      });
    }).catch((reason) => {
      this.bot.console.error(this.bot.lang.repo.error, {name: "modules", e: reason});
    });
  }

  public fetchPlugins() {
    axios.get(this.bot.config.core.repo.url + "/plugins").then((res) => {
      writeFile("./cache/modules.json", res.data, (err) => {
        if(err)
          this.bot.console.error(this.bot.lang.repo.error_write, { name: "plugins" });
      });
    }).catch((reason) => {
      this.bot.console.error(this.bot.lang.repo.error, {name: "plugins", e: reason});
    });
  }

  public fetchCore() {
    axios.get(this.bot.config.core.repo.url + "/core").then((res) => {
      writeFile("./cache/core.json", res.data, (err) => {
        if(err)
          this.bot.console.error(this.bot.lang.repo.error_write, { name: "core" });
      });
    }).catch((reason) => {
      this.bot.console.error(this.bot.lang.repo.error, {name: "core", e: reason});
    });
  }
}