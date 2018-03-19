"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Eloquent_1 = require("./Eloquent");
const lodash_1 = require("lodash");
const EloquentProxy_1 = require("./EloquentProxy");
class EloquentAttribute {
    constructor(model, prototype) {
        this.dynamic = {};
        this.known = [];
        this.findGettersAndSetters(prototype);
        this.findAccessorsAndMutators(prototype);
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
        this.known = Array.from(new Set(model['getReservedProperties']().concat(Object.getOwnPropertyNames(model), EloquentProxy_1.GET_FORWARD_TO_DRIVER_FUNCTIONS, EloquentProxy_1.GET_QUERY_FUNCTIONS, Object.getOwnPropertyNames(Eloquent_1.Eloquent.prototype), Object.getOwnPropertyNames(prototype))));
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
    findAccessorsAndMutators(prototype) {
        const names = Object.getOwnPropertyNames(prototype);
        const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g');
        names.forEach(name => {
            let match;
            while ((match = regex.exec(name)) != undefined) {
                // javascript RegExp has a bug when the match has length 0
                // if (match.index === regex.lastIndex) {
                //   ++regex.lastIndex
                // }
                const property = lodash_1.snakeCase(match[2]);
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
}
exports.EloquentAttribute = EloquentAttribute;
