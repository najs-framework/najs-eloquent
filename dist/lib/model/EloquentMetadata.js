"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const DEFAULT_TIMESTAMPS = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
};
const DEFAULT_SOFT_DELETES = {
    deletedAt: 'deleted_at',
    overrideMethods: false
};
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
    constructor(model) {
        this.model = model;
        this.definition = Object.getPrototypeOf(model).constructor;
        this.knownAttributes = [];
    }
    static get(model, cache = true) {
        const className = model.getClassName();
        if (!this.cached[className] || !cache) {
            this.cached[className] = new EloquentMetadata(najs_binding_1.make(className, ['do-not-initialize']));
        }
        return this.cached[className];
    }
    getSettingProperty(property, defaultValue) {
        if (this.definition[property]) {
            return this.definition[property];
        }
        return this.model[property] ? this.model[property] : defaultValue;
    }
    hasSetting(property) {
        return !!this.getSettingProperty(property, false);
    }
    getSettingWithDefaultForTrueValue(property, defaultValue) {
        const value = this.getSettingProperty(property, false);
        if (value === true) {
            return defaultValue;
        }
        return value || defaultValue;
    }
    fillable() {
        return this.getSettingProperty('fillable', []);
    }
    guarded() {
        return this.getSettingProperty('guarded', ['*']);
    }
    hasTimestamps() {
        return this.hasSetting('timestamps');
    }
    timestamps(defaultValue = DEFAULT_TIMESTAMPS) {
        return this.getSettingWithDefaultForTrueValue('timestamps', defaultValue);
    }
    hasSoftDeletes() {
        return this.hasSetting('softDeletes');
    }
    softDeletes(defaultValue = DEFAULT_SOFT_DELETES) {
        return this.getSettingWithDefaultForTrueValue('softDeletes', defaultValue);
    }
    hasAttribute(name) {
        if (typeof name === 'symbol') {
            return true;
        }
        return this.knownAttributes.indexOf(name) !== -1;
    }
}
/**
 * store EloquentMetadata instance with "sample" model
 */
EloquentMetadata.cached = {};
exports.EloquentMetadata = EloquentMetadata;
