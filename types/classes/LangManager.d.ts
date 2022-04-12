import { Lang } from "../interfaces";
import { ChairWoom } from "..";
export declare type TypeFrom = "module" | "plugin" | "core" | string;
export default class LangManager {
    private bot;
    files: Lang;
    codeName: string;
    constructor(bot: ChairWoom);
    loadLang(type: TypeFrom, from: string): Promise<Lang>;
    unloadLang(from: string): void;
    setLang(codeName: string): Promise<Lang>;
}
