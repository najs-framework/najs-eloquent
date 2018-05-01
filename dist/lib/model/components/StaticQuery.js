"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const najs_binding_2 = require("najs-binding");
const constants_1 = require("../../constants");
class StaticQuery {
    getClassName() {
        return constants_1.NajsEloquent.Driver.Component.StaticQuery;
    }
    extend(prototype, bases, driver) {
        const constructor = prototype.constructor;
        constructor['newQuery'] = StaticQuery.newQuery;
        for (const name of constants_1.StartQueryFunctions) {
            constructor[name] = StaticQuery.forwardToNewQuery(name);
        }
    }
    static newQuery() {
        return najs_binding_1.make(this).newQuery();
    }
    static get ForwardToNewQueryMethods() {
        return constants_1.StartQueryFunctions;
    }
    static forwardToNewQuery(name) {
        return function () {
            return this.newQuery()[name](...arguments);
        };
    }
}
StaticQuery.className = constants_1.NajsEloquent.Driver.Component.StaticQuery;
exports.StaticQuery = StaticQuery;
najs_binding_2.register(StaticQuery);
