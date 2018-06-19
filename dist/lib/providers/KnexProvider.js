"use strict";
/// <reference path="../contracts/KnexProvider.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const Knex = require("knex");
const constants_1 = require("../constants");
const najs_facade_1 = require("najs-facade");
const najs_binding_1 = require("najs-binding");
class KnexProvider extends najs_facade_1.Facade {
    getClassName() {
        return constants_1.NajsEloquent.Provider.KnexProvider;
    }
    setDefaultConfig(config) {
        this.config = config;
        return this;
    }
    getDefaultConfig() {
        return this.config;
    }
    createKnex(config) {
        return Knex(config || this.config);
    }
    createQueryBuilder(table, config) {
        return this.createKnex(config)(table);
    }
}
exports.KnexProvider = KnexProvider;
najs_binding_1.register(KnexProvider, constants_1.NajsEloquent.Provider.KnexProvider);
