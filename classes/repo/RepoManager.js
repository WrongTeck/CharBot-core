"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const crypto_1 = require("crypto");
class RepoManager {
    constructor(bot) {
        this.bot = bot;
        (0, fs_1.stat)("./cache", (err) => {
            if (err)
                (0, fs_1.mkdir)("./cache", (e) => {
                    console.log(e);
                });
        });
        return this;
    }
    getUpdates() {
        let hashes = {};
        (0, fs_1.readFile)("./cache/plugins.hash", { encoding: "base64" }, (err, data) => {
            if (err)
                hashes.plugins = "";
            hashes.plugins = data;
        });
        (0, fs_1.readFile)("./cache/core.hash", { encoding: "base64" }, (err, data) => {
            if (err)
                hashes.core = "";
            hashes.core = data;
        });
        axios_1.default.get(this.bot.config.core.repo.url + "/updates").then((value) => {
            let data = JSON.parse(value.data);
            if (hashes.plugins != data.plugins)
                this.fetchPlugins();
            if (hashes.core != data.core)
                this.fetchCore();
        }).catch((err) => {
            this.bot.console.error("Error while fetching the repositories! Error:\n" + err);
        });
    }
    fetchPlugins() {
        this.fetchUpdate("plugins");
    }
    fetchCore() {
        this.fetchUpdate("core");
    }
    fetchUpdate(name) {
        axios_1.default.get(this.bot.config.core.repo.url + `/${name}`).then((res) => {
            (0, fs_1.writeFile)(`./cache/${name}.json`, res.data, (err) => {
                if (err)
                    this.bot.console.error(this.bot.lang.files.core.repo.error_write, { name });
            });
            (0, fs_1.writeFile)(`./cache/${name}.hash`, (0, crypto_1.createHash)("sha256").update(res.data).digest("base64"), (err) => {
                if (err)
                    this.bot.console.error(this.bot.lang.files.core.repo.error_write, { name: `${name} hash` });
            });
        }).catch((reason) => {
            this.bot.console.error(this.bot.lang.files.core.repo.error, { name, e: reason });
        });
    }
    upgrade(type, name) {
        switch (type) {
            case "all":
                if (name)
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
    pollPlugins() {
        let installed = [];
        (0, fs_1.readdir)("./plugins", { encoding: "utf-8", withFileTypes: true }, (err, data) => {
            if (err)
                return;
            data.forEach((value) => {
                if (!value.isDirectory())
                    return;
                try {
                    let load = require(`./plugins/${value.name}/index.js`);
                    installed.push({
                        name: load.name,
                        version: load.version
                    });
                }
                catch (e) {
                    this.bot.console.debug("Error while loading {name}", { name: value.name });
                }
            });
            (0, fs_1.writeFile)("./cache/installed.json", JSON.stringify(installed), (err) => {
                if (err)
                    return;
            });
        });
    }
}
exports.default = RepoManager;
