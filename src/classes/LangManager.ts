import { Lang } from "../interfaces";
import { access, readFile } from "fs";
import { ChairWoom } from "./ChairWoom";

export type TypeFrom = "plugin" | "core" | string;

export default class LangManager {
  /**
   * All lang files that are currently loaded
   */
  files: Lang = {};
  /**
   * The language code name
   */
  codeName: string;
  constructor(private bot: ChairWoom) {
    return this;
  }

  /**
   * Load a lang file from a module/plugin or
   * from the core
   * If the file for that lang will not be found,
   * it will fallback to English
   * @param from The name of the plugin
   * @param type The type
   */
  loadLang(type: TypeFrom, from: string): Promise<Lang> {
    return new Promise((resolve, reject) => {
      access(`./${type}/${from}/lang/${this.codeName}.json`, (err) => {
        if (err) return reject(err);
        readFile(
          `./${type}/${from}/lang/${this.codeName}.json`,
          { encoding: "utf-8" },
          (errRead, data) => {
            if (errRead) {
              this.bot.console.error(
                `Cannot load ${from} lang files!`
              );
              reject(err);
            }
            try {
              this.bot.emit("core.lang.load", type, from);
              this.files[from] = JSON.parse(data);
              resolve(this.files[from]);
            } catch (e) {
              reject(e);
              this.bot.console.error(e);
            }
          }
        );
      });
    });
  }

  /**
   * Unload a specific lang file from the bot
   * @param from The name of the  /module
   * @param type The type
   */
  unloadLang(from: string) {
    if(this.files[from]) {
      this.bot.emit("core.lang.unload", from);
      delete this.files[from];
    }
  }

  /**
   * Sets which language to select from language files
   * @param codeName The language code
   */
  setLang(codeName: string): Promise<Lang> {
    this.bot.emit("core.lang.code", codeName);
    this.codeName = codeName;
    return new Promise((resolve, reject) => {
      access(`./languages/${codeName}.json`, (err) => {
        if (err) {
          this.bot.console.error(
            "Cannot load the core language file\nIs it updated?"
          );
          reject(err);
        }
        readFile(
          `./languages/${this.codeName}.json`,
          { encoding: "utf-8" },
          (errRead, data) => {
            if (err)
              return reject(errRead);
            try {
              this.bot.emit("core.lang.load", "core");
              this.files.core = JSON.parse(data);
              resolve(this.files.core);
            } catch (e) {
              reject(e);
              this.bot.console.error(e);
            }
          }
        );
      });
    });
  }
}
