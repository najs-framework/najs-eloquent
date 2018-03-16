"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const metadata = {}
/**
 * This class contains all metadata parsing functions, such as:
 *   - fillable
 *   - guarded
 *   - timestamps
 *   - softDeletes
 *   - mutators
 *   - accessors
 * It's support cached in object to increase performance
 */
class EloquentMetadata {
    constructor() { }
    static get(model, cache = true) {
        // if (model.getClassName())
        return new EloquentMetadata();
    }
}
exports.EloquentMetadata = EloquentMetadata;
