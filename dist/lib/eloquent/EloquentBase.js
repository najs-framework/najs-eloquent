"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attributes_proxy_1 = require("../components/attributes_proxy");
const collect_js_1 = require("collect.js");
const najs_1 = require("najs");
const lodash_1 = require("lodash");
class EloquentBase {
    constructor(data) {
        if (!najs_1.ClassRegistry.has(this.getClassName())) {
            najs_1.register(Object.getPrototypeOf(this).constructor, this.getClassName(), false);
        }
        return this.initialize(data);
    }
    newInstance(data) {
        const instance = najs_1.make(this.getClassName());
        return instance.initialize(data);
    }
    newCollection(dataset) {
        return collect_js_1.default(dataset.map(item => this.newInstance(item)));
    }
    fill(data) {
        const fillableAttributes = lodash_1.pick(data, this.getFillable());
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
        return this.fillable || [];
    }
    getGuarded() {
        return this.guarded || ['*'];
    }
    isFillable(key) {
        const fillable = this.getFillable();
        if (fillable.length > 0 && fillable.indexOf(key) !== -1) {
            return true;
        }
        if (this.isGuarded(key)) {
            return false;
        }
        return fillable.length === 0 && this.__knownAttributeList.indexOf(key) === -1 && key.indexOf('_') !== 0;
    }
    isGuarded(key) {
        const guarded = this.getGuarded();
        return (guarded.length === 1 && guarded[0] === '*') || guarded.indexOf(key) !== -1;
    }
    // -------------------------------------------------------------------------------------------------------------------
    initialize(data) {
        if (this.isNativeRecord(data)) {
            this.setAttributesByNativeRecord(data);
        }
        else {
            if (typeof data === 'object') {
                this.setAttributesByObject(data);
            }
            else {
                this.initializeAttributes();
            }
        }
        this.__knownAttributeList = Array.from(new Set(this.getReservedPropertiesList().concat(Object.getOwnPropertyNames(this), Object.getOwnPropertyNames(EloquentBase.prototype), Object.getOwnPropertyNames(Object.getPrototypeOf(this)))));
        const proxy = new Proxy(this, attributes_proxy_1.attributes_proxy());
        return proxy;
    }
    getReservedPropertiesList() {
        return [
            'inspect',
            'valueOf',
            '__knownAttributeList',
            'attributes',
            'fillable',
            'guarded',
            'softDeletes',
            'timestamps',
            'table'
        ];
    }
}
exports.EloquentBase = EloquentBase;
//# sourceMappingURL=EloquentBase.js.map