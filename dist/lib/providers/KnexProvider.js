"use strict";
/// <reference path="../contracts/KnexProvider.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const Knex = require("knex");
const constants_1 = require("../constants");
const najs_facade_1 = require("najs-facade");
const najs_binding_1 = require("najs-binding");
class KnexProvider extends najs_facade_1.Facade {
    constructor() {
        super();
        this.configurations = {};
        this.instances = {};
    }
    getClassName() {
        return constants_1.NajsEloquent.Provider.KnexProvider;
    }
    setConfig(name, config) {
        this.configurations[name] = config;
        this.instances[name] = undefined;
        return this;
    }
    getConfig(name) {
        return this.configurations[name];
    }
    setDefaultConfig(config) {
        return this.setConfig('default', config);
    }
    getDefaultConfig() {
        return this.getConfig('default');
    }
    create(arg1, arg2) {
        if (typeof arg1 === 'object') {
            return Knex(arg1);
        }
        if (typeof arg1 === 'undefined') {
            arg1 = 'default';
        }
        if (typeof arg2 !== 'undefined') {
            this.setConfig(arg1, arg2);
        }
        if (!this.instances[arg1]) {
            this.instances[arg1] = Knex(this.configurations[arg1]);
        }
        return this.instances[arg1];
    }
    createQueryBuilder(table, arg1, arg2) {
        return this.create(arg1, arg2).table(table);
    }
}
exports.KnexProvider = KnexProvider;
najs_binding_1.register(KnexProvider, constants_1.NajsEloquent.Provider.KnexProvider);
