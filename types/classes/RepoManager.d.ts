import { ChairWoom } from "..";
export default class RepoManager {
    private bot;
    constructor(bot: ChairWoom);
    getUpdates(): void;
    fetchPlugins(): void;
    fetchCore(): void;
    upgrade(type: "modules" | "plugins" | "core" | "all" | string, name?: string, version?: string): void;
}
