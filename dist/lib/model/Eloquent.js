"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const EloquentMetadata_1 = require("./EloquentMetadata");
const EloquentDriverProviderFacade_1 = require("../facades/global/EloquentDriverProviderFacade");
const EloquentProxy_1 = require("./EloquentProxy");
const lodash_1 = require("lodash");
const collect_js_1 = require("collect.js");
/**
 * Base class of an Eloquent, handles proxy attributes, contains cross-driver features like
 *   - fill
 *   - touch
 *   - member Querying
 *   - static Querying
 */
class Eloquent {
    constructor(data, isGuarded = true) {
        this.driver = EloquentDriverProviderFacade_1.EloquentDriverProvider.create(this, isGuarded);
        if (data !== 'do-not-initialize') {
            this.driver.initialize(data);
            this.attributes = this.driver.getRecord();
            return new Proxy(this, EloquentProxy_1.EloquentProxy);
        }
    }
    getModelName() {
        return this.getClassName();
    }
    getAttribute(name) {
        return this.driver.getAttribute(name);
    }
    setAttribute(name, value) {
        return this.driver.setAttribute(name, value);
    }
    toObject() {
        return this.driver.toObject();
    }
    toJSON() {
        return this.driver.toJSON();
    }
    toJson() {
        return this.driver.toJSON();
    }
    fill(data) {
        const fillable = this.getFillable();
        const fillableAttributes = fillable.length > 0 ? lodash_1.pick(data, fillable) : data;
        for (const key in fillableAttributes) {
            if (this.isFillable(key)) {
                this.setAttribute(key, fillableAttributes[key]);
            }
        }
        return this;
    }
    forceFill(data) {
        for (const key in data) {
            this.setAttribute(key, data[key]);
        }
        return this;
    }
    getFillable() {
        return EloquentMetadata_1.EloquentMetadata.get(this).fillable();
    }
    getGuarded() {
        return EloquentMetadata_1.EloquentMetadata.get(this).guarded();
    }
    isFillable(key) {
        const fillable = this.getFillable();
        if (fillable.length > 0 && fillable.indexOf(key) !== -1) {
            return true;
        }
        if (this.isGuarded(key)) {
            return false;
        }
        return fillable.length === 0 && !EloquentMetadata_1.EloquentMetadata.get(this).hasAttribute(key) && key.indexOf('_') !== 0;
    }
    isGuarded(key) {
        const guarded = this.getGuarded();
        return (guarded.length === 1 && guarded[0] === '*') || guarded.indexOf(key) !== -1;
    }
    newInstance(data) {
        return najs_binding_1.make(this.getClassName(), [data]);
    }
    newCollection(dataset) {
        return collect_js_1.default(dataset.map(item => this.newInstance(item)));
    }
    getReservedNames() {
        return [
            'inspect',
            'valueOf',
            'attributes',
            'driver',
            'fillable',
            'guarded',
            'softDeletes',
            'timestamps',
            'table',
            'collection',
            'schema',
            'options'
        ].concat(this.driver.getReservedNames());
    }
}
exports.Eloquent = Eloquent;
