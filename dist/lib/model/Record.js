"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * Base class for drivers which are native mongodb or knex. Handles attribute interactions only.
 */
class Record {
    constructor(data) {
        if (data instanceof Record) {
            this.data = data.data;
        }
        else {
            this.data = data || {};
        }
        this.modified = [];
    }
    getAttribute(path) {
        return lodash_1.get(this.data, path);
    }
    setAttribute(path, value) {
        const originalValue = lodash_1.get(this.data, path);
        if (!lodash_1.isEqual(originalValue, value)) {
            lodash_1.set(this.data, path, value);
            this.markModified(path);
        }
        return true;
    }
    getModified() {
        return this.modified;
    }
    markModified(name) {
        if (this.modified.indexOf(name) === -1) {
            this.modified.push(name);
        }
    }
    toObject() {
        return this.data;
    }
}
exports.Record = Record;
