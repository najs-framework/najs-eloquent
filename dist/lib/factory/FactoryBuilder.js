"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const lodash_1 = require("lodash");
const collect_js_1 = require("collect.js");
const Eloquent_1 = require("../model/Eloquent");
class FactoryBuilder {
    constructor(className, name, definitions, states, faker) {
        this.className = className;
        this.name = name;
        this.definitions = definitions;
        this.definedStates = states;
        this.faker = faker;
    }
    times(amount) {
        this.amount = amount;
        return this;
    }
    states(...states) {
        this.activeStates = !this.activeStates ? lodash_1.flatten(states) : this.activeStates.concat(lodash_1.flatten(states));
        return this;
    }
    async create(attributes) {
        const result = this.make(attributes);
        if (result instanceof Eloquent_1.Eloquent) {
            await result['save']();
            return result;
        }
        return result.each(async (item) => {
            await item['save']();
        });
    }
    make(attributes) {
        if (typeof this.amount === 'undefined') {
            return this.makeInstance(attributes);
        }
        if (this.amount < 1) {
            return najs_binding_1.make(this.className, []).newCollection([]);
        }
        return najs_binding_1.make(this.className, []).newCollection(lodash_1.range(0, this.amount).map((item) => this.getRawAttributes(attributes)));
    }
    raw(attributes) {
        if (typeof this.amount === 'undefined') {
            return this.getRawAttributes(attributes);
        }
        if (this.amount < 1) {
            return collect_js_1.default([]);
        }
        return collect_js_1.default(lodash_1.range(0, this.amount).map((item) => this.getRawAttributes(attributes)));
    }
    makeInstance(attributes) {
        // The false value is isGuarded
        return najs_binding_1.make(this.className, [this.getRawAttributes(attributes), false]);
    }
    getRawAttributes(attributes) {
        if (!this.definitions[this.className] || !lodash_1.isFunction(this.definitions[this.className][this.name])) {
            throw new ReferenceError(`Unable to locate factory with name [${this.name}] [${this.className}].`);
        }
        const definition = Reflect.apply(this.definitions[this.className][this.name], undefined, [
            this.faker,
            attributes
        ]);
        return this.triggerReferenceAttributes(Object.assign(this.applyStates(definition, attributes), attributes));
    }
    applyStates(definition, attributes) {
        if (typeof this.activeStates === 'undefined') {
            return definition;
        }
        for (const state of this.activeStates) {
            if (!this.definedStates[this.className] || !lodash_1.isFunction(this.definedStates[this.className][state])) {
                throw new ReferenceError(`Unable to locate [${state}] state for [${this.className}].`);
            }
            Object.assign(definition, Reflect.apply(this.definedStates[this.className][state], undefined, [this.faker, attributes]));
        }
        return definition;
    }
    triggerReferenceAttributes(attributes) {
        for (const name in attributes) {
            if (lodash_1.isFunction(attributes[name])) {
                attributes[name] = attributes[name].call(undefined, attributes);
            }
            if (attributes[name] instanceof Eloquent_1.Eloquent) {
                attributes[name] = attributes[name].getPrimaryKey();
            }
            if (lodash_1.isPlainObject(attributes[name])) {
                this.triggerReferenceAttributes(attributes[name]);
            }
        }
        return attributes;
    }
}
exports.FactoryBuilder = FactoryBuilder;
