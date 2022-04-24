import { ChairWoom } from "../ChairWoom";
export default class RepoManager {
    private bot;
    constructor(bot: ChairWoom);
    getUpdates(): void;
    fetchPlugins(): void;
    fetchCore(): void;
    private fetchUpdate;
    upgrade(type?: "plugins" | "core" | "all" | string, name?: string): void;
    private pollPlugins;
}
