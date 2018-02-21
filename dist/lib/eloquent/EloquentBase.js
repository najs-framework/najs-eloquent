"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attributes_proxy_1 = require("../components/attributes_proxy");
const collect_js_1 = require("collect.js");
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
class EloquentBase {
    constructor(data) {
        this.registerIfNeeded();
        return this.initialize(data);
    }
    get id() {
        return this.getId();
    }
    set id(value) {
        this.setId(value);
    }
    registerIfNeeded() {
        if (!najs_binding_1.ClassRegistry.has(this.getClassName())) {
            najs_binding_1.register(Object.getPrototypeOf(this).constructor, this.getClassName(), false);
        }
    }
    newInstance(data) {
        const instance = najs_binding_1.make(this.getClassName());
        instance.fillable = this.fillable;
        instance.guarded = this.guarded;
        return instance.initialize(data);
    }
    newCollection(dataset) {
        return collect_js_1.default(dataset.map(item => this.newInstance(item)));
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
    findGettersAndSetters() {
        // accessor by getter, only available for node >= 8.7
        const descriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this));
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
        const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g');
        for (const name of names) {
            let match;
            while ((match = regex.exec(name)) != undefined) {
                // javascript RegExp has a bug when the match has length 0
                // if (match.index === regex.lastIndex) {
                //   ++regex.lastIndex
                // }
                const property = lodash_1.snakeCase(match[2]);
                if (match[1] === 'get') {
                    if (typeof this.accessors[property] !== 'undefined') {
                        continue;
                    }
                    this.accessors[property] = {
                        name: property,
                        type: 'function',
                        ref: match[0]
                    };
                }
                else {
                    if (typeof this.mutators[property] !== 'undefined') {
                        continue;
                    }
                    this.mutators[property] = {
                        name: property,
                        type: 'function',
                        ref: match[0]
                    };
                }
            }
        }
    }
    getAllValueOfAccessors() {
        return Object.keys(this.accessors).reduce((memo, key) => {
            const accessor = this.accessors[key];
            if (accessor.type === 'getter') {
                memo[key] = this[key];
            }
            else {
                memo[key] = this[accessor.ref].call(this);
            }
            return memo;
        }, {});
    }
    // -------------------------------------------------------------------------------------------------------------------
    initialize(data) {
        this.accessors = {};
        this.mutators = {};
        this.findGettersAndSetters();
        this.findAccessorsAndMutators();
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
EloquentBase.timestamps = false;
EloquentBase.softDeletes = false;
exports.EloquentBase = EloquentBase;
