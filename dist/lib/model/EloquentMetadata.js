"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const Eloquent_1 = require("./Eloquent");
const EloquentProxy_1 = require("./EloquentProxy");
const lodash_1 = require("lodash");
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
        this.accessors = {};
        this.mutators = {};
        this.buildKnownAttributes();
        this.findGettersAndSetters();
        this.findAccessorsAndMutators();
    }
    buildKnownAttributes() {
        this.knownAttributes = Array.from(new Set(this.model['getReservedProperties']().concat(Object.getOwnPropertyNames(this.model), EloquentProxy_1.GET_FORWARD_TO_DRIVER_FUNCTIONS, EloquentProxy_1.GET_QUERY_FUNCTIONS, Object.getOwnPropertyNames(Eloquent_1.Eloquent.prototype), Object.getOwnPropertyNames(this.prototype))));
    }
    /**
     * Find accessors and mutators defined in getter/setter, only available for node >= 8.7
     */
    findGettersAndSetters() {
        const descriptors = Object.getOwnPropertyDescriptors(this.prototype);
        for (const name in descriptors) {
            if (lodash_1.isFunction(descriptors[name].get)) {
                this.accessors[name] = {
                    name: name,
                    type: 'getter'
                };
            }
            if (lodash_1.isFunction(descriptors[name].set)) {
                this.mutators[name] = {
                    name: name,
                    type: 'setter'
                };
            }
        }
    }
    findAccessorsAndMutators() {
        const names = Object.getOwnPropertyNames(this.prototype);
        const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g');
        names.forEach(name => {
            let match;
            while ((match = regex.exec(name)) != undefined) {
                // javascript RegExp has a bug when the match has length 0
                // if (match.index === regex.lastIndex) {
                //   ++regex.lastIndex
                // }
                const property = lodash_1.snakeCase(match[2]);
                const data = {
                    name: property,
                    type: 'function',
                    ref: match[0]
                };
                if (match[1] === 'get' && typeof this.accessors[property] === 'undefined') {
                    this.accessors[property] = data;
                }
                if (match[1] === 'set' && typeof this.mutators[property] === 'undefined') {
                    this.mutators[property] = data;
                }
            }
        });
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
