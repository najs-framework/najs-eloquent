"use strict";
/// <reference path="../../contracts/FactoryManager.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("../../factory/FactoryManager");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const container_1 = require("../container");
const constants_1 = require("../../constants");
const facade = najs_facade_1.Facade.create(container_1.container, 'FactoryManager', function () {
    return najs_binding_1.make(constants_1.NajsEloquent.Factory.FactoryManager);
});
exports.FactoryFacade = facade;
exports.Factory = facade;
exports.factory = (function (className, arg1, arg2) {
    let name = 'default';
    if (typeof arg1 === 'string') {
        name = arg1;
    }
    let amount = undefined;
    if (typeof arg1 === 'number') {
        amount = arg1;
    }
    if (typeof arg2 === 'number') {
        amount = arg2;
    }
    return typeof amount === 'undefined'
        ? exports.Factory.of(className, name)
        : exports.Factory.of(className, name).times(amount);
});
