"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceHolders = void 0;
class PlaceHolders {
    constructor() {
        return this;
    }
    parse(data, placeHolders) {
        if (typeof data !== "string" || !data) {
            return data;
        }
        if (!placeHolders)
            return data.toString();
        if (typeof placeHolders !== "object") {
            return data;
        }
        let keys = Object.keys(placeHolders);
        let values = Object.values(placeHolders);
        for (const key in keys) {
            try {
                data = data.replace(`{${keys[key]}}`, values[key]);
            }
            catch (e) {
                console.error(e);
            }
        }
        return data.toString();
    }
}
exports.PlaceHolders = PlaceHolders;
exports.default = PlaceHolders;
