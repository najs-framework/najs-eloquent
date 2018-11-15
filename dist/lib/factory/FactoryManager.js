"use strict";
/// <reference path="../contracts/FactoryManager.ts" />
/// <reference path="../contracts/FactoryBuilder.ts" />
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/factory/IFactoryDefinition.ts" />
/// <reference types="chance" />
Object.defineProperty(exports, "__esModule", { value: true });
require("./FactoryBuilder");
const najs_facade_1 = require("najs-facade");
const najs_binding_1 = require("najs-binding");
const chance_1 = require("chance");
const constants_1 = require("../constants");
class FactoryManager extends najs_facade_1.Facade {
    constructor() {
        super();
        this.faker = new chance_1.Chance();
        this.definitions = {};
        this.states = {};
    }
    getClassName() {
        return constants_1.NajsEloquent.Factory.FactoryManager;
    }
    addDefinition(bag, className, name, definition) {
        const modelName = this.getModelName(className);
        if (!this[bag][modelName]) {
            this[bag][modelName] = {};
        }
        this[bag][modelName][name] = definition;
        return this;
    }
    getModelName(className) {
        if (typeof className === 'function') {
            return najs_binding_1.getClassName(className);
        }
        return className;
    }
    define(className, definition, name = 'default') {
        return this.addDefinition('definitions', className, name, definition);
    }
    defineAs(className, name, definition) {
        return this.define(className, definition, name);
    }
    state(className, state, definition) {
        return this.addDefinition('states', className, state, definition);
    }
    of(className, name = 'default') {
        return najs_binding_1.make(constants_1.NajsEloquent.Factory.FactoryBuilder, [
            this.getModelName(className),
            name,
            this.definitions,
            this.states,
            this.faker
        ]);
    }
}
FactoryManager.className = constants_1.NajsEloquent.Factory.FactoryManager;
exports.FactoryManager = FactoryManager;
// implicit implements partial of FactoryManager
const funcs = {
    create: 'create',
    createAs: 'create',
    make: 'make',
    makeAs: 'make',
    raw: 'raw',
    rawOf: 'raw'
};
for (const name in funcs) {
    const hasName = name !== funcs[name];
    FactoryManager.prototype[name] = function () {
        const builder = this.of(arguments[0], hasName ? arguments[1] : 'default');
        const second = arguments[hasName ? 2 : 1];
        const third = arguments[hasName ? 3 : 2];
        if (typeof second === 'number') {
            return builder.times(second)[funcs[name]](third);
        }
        return builder[funcs[name]](second);
    };
}
najs_binding_1.register(FactoryManager, constants_1.NajsEloquent.Factory.FactoryManager);
