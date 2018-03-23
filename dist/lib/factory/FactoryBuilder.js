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
        this.activeStates = lodash_1.flatten(states);
        return this;
    }
    async create(attributes) {
        const result = this.make(attributes);
        if (result instanceof Eloquent_1.Eloquent) {
            await result['save']();
        }
        else {
            result.each(async (item) => {
                await item['save']();
            });
        }
        return result;
    }
    make(attributes) {
        if (typeof this.amount === 'undefined') {
            return this.makeInstance(attributes);
        }
        if (this.amount < 1) {
            return najs_binding_1.make(this.className, []).newCollection([]);
        }
        return najs_binding_1.make(this.className, []).newCollection(lodash_1.range(0, this.amount).map((item) => this.makeInstance(attributes)));
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
    makeInstance(attribute) { }
    getRawAttributes(attribute) { }
}
exports.FactoryBuilder = FactoryBuilder;
