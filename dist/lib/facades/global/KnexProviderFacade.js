"use strict";
/// <reference path="../../contracts/KnexProvider.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
require("../../providers/KnexProvider");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const container_1 = require("../container");
const constants_1 = require("../../constants");
const facade = najs_facade_1.Facade.create(container_1.container, 'KnexProvider', function () {
    return najs_binding_1.make(constants_1.NajsEloquent.Provider.KnexProvider);
});
exports.KnexProviderFacade = facade;
exports.KnexProvider = facade;
