"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentProxy_1 = require("./EloquentProxy");
/**
 * Base class of an Eloquent, handles proxy attributes, contains cross-driver features like
 *   - fill
 *   - touch
 *   - member Querying
 *   - static Querying
 */
class Eloquent {
    constructor(data) {
        if (data !== 'do-not-initialize') {
            return new Proxy(this, EloquentProxy_1.EloquentProxy);
        }
    }
    getDriver() {
        return {};
    }
    getAttribute(name) { }
}
exports.Eloquent = Eloquent;
