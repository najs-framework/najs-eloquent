"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FactoryBuilder {
    constructor(className, name, definitions, states, faker) {
        this.className = className;
        this.name = name;
        this.definitions = definitions;
        this.states = states;
        this.faker = faker;
    }
}
exports.FactoryBuilder = FactoryBuilder;
