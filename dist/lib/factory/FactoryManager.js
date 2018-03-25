"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
const FactoryBuilder_1 = require("./FactoryBuilder");
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
        return constants_1.NajsEloquentClass.FactoryManager;
    }
    initBagIfNeeded(name, className) {
        if (!this[name][className]) {
            this[name][className] = {};
        }
    }
    define(className, definition, name = 'default') {
        this.initBagIfNeeded('definitions', className);
        this.definitions[className][name] = definition;
        return this;
    }
    defineAs(className, name, definition) {
        return this.define(className, definition, name);
    }
    state(className, state, definition) {
        this.initBagIfNeeded('states', className);
        this.states[className][state] = definition;
        return this;
    }
    of(className, name = 'default') {
        return new FactoryBuilder_1.FactoryBuilder(className, name, this.definitions, this.states, this.faker);
    }
    create(className) {
        return this.of(className).create(arguments[1]);
    }
    createAs(className, name) {
        return this.of(className, name).create(arguments[2]);
    }
    make(className) {
        return this.of(className).make(arguments[1]);
    }
    makeAs(className, name) {
        return this.of(className, name).make(arguments[2]);
    }
    raw(className) {
        return this.of(className).raw(arguments[1]);
    }
    rawOf(className, name) {
        return this.of(className, name).raw(arguments[2]);
    }
}
FactoryManager.className = constants_1.NajsEloquentClass.FactoryManager;
exports.FactoryManager = FactoryManager;
najs_binding_1.register(FactoryManager);
