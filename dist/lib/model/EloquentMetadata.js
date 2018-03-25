"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const EloquentAttribute_1 = require("./EloquentAttribute");
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
        this.prototype = Object.getPrototypeOf(this.model);
        this.definition = Object.getPrototypeOf(model).constructor;
        this.attribute = new EloquentAttribute_1.EloquentAttribute(model, this.prototype);
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
    visible() {
        return this.getSettingProperty('visible', []);
    }
    hidden() {
        return this.getSettingProperty('hidden', []);
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
        return this.attribute.isKnownAttribute(name);
    }
    static get(model, cache = true) {
        const className = model.getClassName();
        if (!this.cached[className] || !cache) {
            this.cached[className] = new EloquentMetadata(najs_binding_1.make(className, ['do-not-initialize']));
        }
        return this.cached[className];
    }
}
/**
 * store EloquentMetadata instance with "sample" model
 */
EloquentMetadata.cached = {};
exports.EloquentMetadata = EloquentMetadata;
