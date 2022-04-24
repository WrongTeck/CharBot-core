import ChairWoom from "../ChairWoom";
export default class Upgrade {
    private bot;
    constructor(bot: ChairWoom);
    package(name: string, type: "core" | "plugin"): void;
    upgradeAll(type?: "core" | "plugin"): void;
}
