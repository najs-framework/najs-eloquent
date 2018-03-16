"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class of an Eloquent, handles proxy attributes, contains cross-driver features like
 *   - fill
 *   - touch
 *   - member Querying
 *   - static Querying
 */
class Eloquent {
    getDriver() {
        return {};
    }
}
exports.Eloquent = Eloquent;
