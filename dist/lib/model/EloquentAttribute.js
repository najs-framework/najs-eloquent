"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Eloquent_1 = require("./Eloquent");
const lodash_1 = require("lodash");
class EloquentAttribute {
    constructor(model, prototype) {
        this.dynamic = {};
        this.known = [];
        this.findGettersAndSetters(prototype);
        this.findAccessorsAndMutators(model, prototype);
        this.buildKnownAttributes(model, prototype);
    }
    createDynamicAttributeIfNeeded(property) {
        if (!this.dynamic[property]) {
            this.dynamic[property] = {
                name: property,
                getter: false,
                setter: false
            };
        }
    }
    isKnownAttribute(name) {
        if (typeof name === 'symbol') {
            return true;
        }
        return this.known.indexOf(name) !== -1;
    }
    buildKnownAttributes(model, prototype) {
        this.known = Array.from(new Set(model['getReservedNames']().concat(Object.getOwnPropertyNames(model), model['driver'].getDriverProxyMethods(), model['driver'].getQueryProxyMethods(), Object.getOwnPropertyNames(Eloquent_1.Eloquent.prototype), Object.getOwnPropertyNames(prototype))));
    }
    findGettersAndSetters(prototype) {
        const descriptors = Object.getOwnPropertyDescriptors(prototype);
        for (const property in descriptors) {
            const getter = lodash_1.isFunction(descriptors[property].get);
            const setter = lodash_1.isFunction(descriptors[property].set);
            if (!getter && !setter) {
                continue;
            }
            this.createDynamicAttributeIfNeeded(property);
            this.dynamic[property].getter = getter;
            this.dynamic[property].setter = setter;
        }
    }
    findAccessorsAndMutators(model, prototype) {
        const names = Object.getOwnPropertyNames(prototype);
        const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g');
        names.forEach(name => {
            let match;
            while ((match = regex.exec(name)) != undefined) {
                // javascript RegExp has a bug when the match has length 0
                // if (match.index === regex.lastIndex) {
                //   ++regex.lastIndex
                // }
                const property = model['driver'].formatAttributeName(match[2]);
                this.createDynamicAttributeIfNeeded(property);
                if (match[1] === 'get') {
                    this.dynamic[property].accessor = match[0];
                }
                else {
                    this.dynamic[property].mutator = match[0];
                }
            }
        });
    }
    getAttribute(target, attribute) {
        if (!this.dynamic[attribute]) {
            return target.getAttribute(attribute);
        }
        if (this.dynamic[attribute].getter) {
            return target[attribute];
        }
        if (!this.dynamic[attribute].getter && this.dynamic[attribute].accessor) {
            return target[this.dynamic[attribute].accessor].call(target);
        }
        return target.getAttribute(attribute);
    }
    setAttribute(target, attribute, value) {
        if (!this.dynamic[attribute]) {
            return target.setAttribute(attribute, value);
        }
        if (this.dynamic[attribute].setter) {
            target[attribute] = value;
            return true;
        }
        if (!this.dynamic[attribute].setter && this.dynamic[attribute].mutator) {
            target[this.dynamic[attribute].mutator].call(target, value);
            return true;
        }
        return target.setAttribute(attribute, value);
    }
}
exports.EloquentAttribute = EloquentAttribute;
